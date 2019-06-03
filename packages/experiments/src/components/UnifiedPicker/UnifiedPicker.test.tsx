/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
/* tslint:enable:no-unused-variable */
import * as renderer from 'react-test-renderer';

import { IUnifiedPickerProps, UnifiedPickerFloatingPickerProps } from './UnifiedPicker.types';
import { UnifiedPickerImpl } from './UnifiedPicker';
import { FloatingSuggestions, SuggestionsStore } from '../FloatingSuggestions';
import { ISelectedItemProps, ISelectedItemsListProps } from '../SelectedItemsList/SelectedItemsList.types';
import { SelectedItemsList } from '../SelectedItemsList/SelectedItemsList';
import { KeyCodes } from 'office-ui-fabric-react/lib/Utilities';
import { ISuggestionModel } from 'office-ui-fabric-react/lib/Pickers';

function onResolveSuggestions(text: string): ISimple[] {
  return [
    'black',
    'blue',
    'brown',
    'cyan',
    'green',
    'magenta',
    'mauve',
    'orange',
    'pink',
    'purple',
    'red',
    'rose',
    'violet',
    'white',
    'yellow'
  ]
    .filter((tag: string) => tag.toLowerCase().indexOf(text.toLowerCase()) === 0)
    .map((item: string) => ({ key: item, name: item }));
}

const basicSuggestionRenderer = (props: ISuggestionModel<ISimple>) => {
  return <div key={props.item.key}> {props.item.name} </div>;
};

const basicItemRenderer = (props: ISelectedItemProps<ISimple>) => {
  return <div key={props.key}> {props.name} </div>;
};

const BasicFloatingSuggestions = <T extends UnifiedPickerFloatingPickerProps<ISimple>>(props: T) => {
  return (
    <FloatingSuggestions
      onResolveSuggestions={onResolveSuggestions}
      onRenderSuggestionsItem={basicSuggestionRenderer}
      suggestionsStore={new SuggestionsStore<ISimple>()}
      {...props}
    />
  );
};

const BasicSelectedItemsList = (props: ISelectedItemsListProps<ISimple>) => {
  return <SelectedItemsList<ISimple> onRenderItem={basicItemRenderer} {...props} />;
};

export interface ISimple {
  key: string;
  name: string;
}

export type TypedBaseUnifiedPicker = UnifiedPickerImpl<ISimple>;

describe('UnifiedPicker', () => {
  const BaseUnifiedPickerWithType: new (props: IUnifiedPickerProps<ISimple>) => UnifiedPickerImpl<ISimple> = UnifiedPickerImpl;

  it('renders BaseUnifiedPicker correctly', () => {
    const component = renderer.create(
      <BaseUnifiedPickerWithType onRenderSelectedItems={BasicSelectedItemsList} onRenderFloatingPicker={BasicFloatingSuggestions} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('force resolves to the first suggestion', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const overrideOnResolveSuggestions = () => [{ key: 'a', name: 'test1' }, { key: 'b', name: 'test2' }];

    const renderSuggestions = (props: UnifiedPickerFloatingPickerProps<ISimple>) => (
      <BasicFloatingSuggestions {...props} onResolveSuggestions={overrideOnResolveSuggestions} />
    );

    const picker: TypedBaseUnifiedPicker = (ReactDOM.render(
      <BaseUnifiedPickerWithType onRenderSelectedItems={BasicSelectedItemsList} onRenderFloatingPicker={renderSuggestions} />,
      root
    ) as unknown) as TypedBaseUnifiedPicker;

    expect(picker.inputElement).toBeTruthy();
    if (picker.inputElement) {
      picker.inputElement.value = 'bl';
      picker.inputElement.focus();
    }

    expect(picker.floatingPicker.current && picker.floatingPicker.current.suggestions.length).toBe(2);
    expect(picker.floatingPicker.current && picker.floatingPicker.current.suggestions[0].item.name).toBe('test1');

    // Force resolve to the first suggestions
    expect(picker.floatingPicker.current).toBeTruthy();
    picker.floatingPicker.current && picker.floatingPicker.current.forceResolveSuggestion();

    expect(picker.value.length).toBe(1);
    expect(picker.value[0].name).toBe('test1');

    ReactDOM.unmountComponentAtNode(root);
  });

  it('Completes the suggestion', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const picker: TypedBaseUnifiedPicker = (ReactDOM.render(
      <BaseUnifiedPickerWithType onRenderSelectedItems={BasicSelectedItemsList} onRenderFloatingPicker={BasicFloatingSuggestions} />,
      root
    ) as unknown) as TypedBaseUnifiedPicker;

    if (picker.inputElement) {
      picker.inputElement.value = 'bl';
      ReactTestUtils.Simulate.keyDown(picker.inputElement, { which: KeyCodes.down });
    }

    picker.floatingPicker.current && picker.floatingPicker.current.onCurrentlySelectedSuggestionChosen();
    expect(picker.selectedItemsList.current && picker.value.length).toBe(1);
    expect(picker.selectedItemsList.current && picker.value[0].name).toBe('blue');

    ReactDOM.unmountComponentAtNode(root);
  });

  describe('As an uncontrolled component going through a state change', () => {
    it('Does not remove elements when pressing backspace over a non-empty input', () => {
      const root = document.createElement('div');
      document.body.appendChild(root);
      const onItemsRemovedSpy = jasmine.createSpy();

      const picker: TypedBaseUnifiedPicker = (ReactDOM.render(
        <BaseUnifiedPickerWithType
          defaultSelectedItems={[{ key: '1', name: 'one' }, { key: '2', name: 'two' }]}
          onRenderSelectedItems={BasicSelectedItemsList}
          onRenderFloatingPicker={BasicFloatingSuggestions}
          onItemsRemoved={onItemsRemovedSpy}
        />,
        root
      ) as unknown) as TypedBaseUnifiedPicker;

      if (!picker.inputElement) {
        throw new Error('picker input element not set!');
      }
      picker.inputElement.value = 'hi';
      ReactTestUtils.Simulate.keyDown(picker.inputElement, { which: KeyCodes.backspace });

      expect(onItemsRemovedSpy).not.toBeCalled();
      expect(picker.value.length).toBe(2);

      ReactDOM.unmountComponentAtNode(root);
    });

    it('Removes the last element when pressing backspace over an empty input', () => {
      const root = document.createElement('div');
      document.body.appendChild(root);
      const onItemsRemovedSpy = jasmine.createSpy();

      const picker: TypedBaseUnifiedPicker = (ReactDOM.render(
        <BaseUnifiedPickerWithType
          defaultSelectedItems={[{ key: '1', name: 'one' }, { key: '2', name: 'two' }]}
          onRenderSelectedItems={BasicSelectedItemsList}
          onRenderFloatingPicker={BasicFloatingSuggestions}
          onItemsRemoved={onItemsRemovedSpy}
        />,
        root
      ) as unknown) as TypedBaseUnifiedPicker;

      if (!picker.inputElement) {
        throw new Error('picker input element not set!');
      }
      picker.inputElement.value = '';
      ReactTestUtils.Simulate.keyDown(picker.inputElement, { which: KeyCodes.backspace });

      expect(onItemsRemovedSpy).toBeCalled();
      expect(picker.value).toEqual([
        {
          key: '1',
          name: 'one'
        }
      ]);

      ReactDOM.unmountComponentAtNode(root);
    });

    it('Filters out removed elements on SelectedItems.onItemsRemoved callback called', () => {
      const root = document.createElement('div');
      document.body.appendChild(root);
      const onItemsRemovedSpy = jasmine.createSpy();

      let selectedItemsonItemsRemovedCallback: ((items: ISimple[]) => void) | undefined;
      const SimpleItem = (item: ISelectedItemProps<ISimple>) => <>{item.item.name}</>;
      const InjectedSelectedItemsComponent: IUnifiedPickerProps<ISimple>['onRenderSelectedItems'] = props => {
        selectedItemsonItemsRemovedCallback = props.onItemsRemoved;
        return <SelectedItemsList<ISimple> {...props} onRenderItem={SimpleItem} />;
      };

      const items = [{ key: '1', name: 'one' }, { key: '2', name: 'two' }];

      const picker: TypedBaseUnifiedPicker = (ReactDOM.render(
        <BaseUnifiedPickerWithType
          defaultSelectedItems={items}
          onRenderFloatingPicker={BasicFloatingSuggestions}
          onItemsRemoved={onItemsRemovedSpy}
          onRenderSelectedItems={InjectedSelectedItemsComponent}
        />,
        root
      ) as unknown) as TypedBaseUnifiedPicker;

      if (!picker.inputElement) {
        throw new Error('picker input element not set!');
      }
      if (!selectedItemsonItemsRemovedCallback) {
        throw new Error('selectedItemsonItemsRemovedCallback callback not set!');
      }

      selectedItemsonItemsRemovedCallback([items[0]]);

      expect(onItemsRemovedSpy).toBeCalled();
      expect(picker.value).toEqual([
        {
          key: '2',
          name: 'two'
        }
      ]);

      ReactDOM.unmountComponentAtNode(root);
    });
  });
});
