/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
/* tslint:enable:no-unused-variable */
import * as renderer from 'react-test-renderer';

import { IUnifiedPickerProps } from './UnifiedPicker.types';
import { UnifiedPicker } from './UnifiedPicker';
import { IBaseFloatingPickerProps, BaseFloatingPicker, SuggestionsStore } from 'office-ui-fabric-react/lib/FloatingPicker';
import { IBaseSelectedItemsListProps, ISelectedItemProps, BaseSelectedItemsList } from 'office-ui-fabric-react/lib/SelectedItemsList';
import { KeyCodes } from 'office-ui-fabric-react/lib/Utilities';

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

const BasePickerWithType = BaseFloatingPicker as new (props: IBaseFloatingPickerProps<ISimple>) => BaseFloatingPicker<ISimple>;

const BaseSelectedItemsListWithType = BaseSelectedItemsList as new (props: IBaseSelectedItemsListProps<ISimple>) => BaseSelectedItemsList<
  ISimple,
  IBaseSelectedItemsListProps<ISimple>
>;

const basicSuggestionRenderer = (props: ISimple) => {
  return <div> {props.name} </div>;
};

const basicItemRenderer = (props: ISelectedItemProps<ISimple>) => {
  return <div> {props.name} </div>;
};

const BasicFloatingPicker = (props: IBaseFloatingPickerProps<ISimple>) => {
  return (
    <BasePickerWithType
      onResolveSuggestions={onResolveSuggestions}
      onRenderSuggestionsItem={basicSuggestionRenderer}
      suggestionsStore={new SuggestionsStore<ISimple>()}
      {...props}
    />
  );
};

const BasicSelectedItemsList = (props: IBaseSelectedItemsListProps<ISimple>) => {
  return <BaseSelectedItemsListWithType onRenderItem={basicItemRenderer} {...props} />;
};

export interface ISimple {
  key: string;
  name: string;
}

export type TypedBaseUnifiedPicker = UnifiedPicker<ISimple>;

describe('Pickers', () => {
  describe('BasePicker', () => {
    const BaseUnifiedPickerWithType: new (props: IUnifiedPickerProps<ISimple>) => UnifiedPicker<ISimple> = UnifiedPicker;

    it('renders BaseUnifiedPicker correctly', () => {
      const component = renderer.create(
        <BaseUnifiedPickerWithType onRenderSelectedItems={BasicSelectedItemsList} onRenderFloatingPicker={BasicFloatingPicker} />
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('force resolves to the first suggestion', () => {
      const root = document.createElement('div');
      document.body.appendChild(root);

      const picker: TypedBaseUnifiedPicker = ReactDOM.render(
        <BaseUnifiedPickerWithType onRenderSelectedItems={BasicSelectedItemsList} onRenderFloatingPicker={BasicFloatingPicker} />,
        root
      ) as TypedBaseUnifiedPicker;

      if (picker.inputElement) {
        picker.inputElement.value = 'bl';
      }

      expect(picker.floatingPicker.current && picker.floatingPicker.current.suggestions.length).toBe(2);
      expect(picker.floatingPicker.current && picker.floatingPicker.current.suggestions[0].name).toBe('black');

      // Force resolve to the first suggestions
      picker.floatingPicker.current && picker.floatingPicker.current.forceResolveSuggestion();
      expect(picker.items.length).toBe(1);
      expect(picker.items[0].name).toBe('black');

      ReactDOM.unmountComponentAtNode(root);
    });

    it('Can hide and show picker', () => {
      const root = document.createElement('div');
      document.body.appendChild(root);

      const picker: TypedBaseUnifiedPicker = ReactDOM.render(
        <BaseUnifiedPickerWithType onRenderSelectedItems={BasicSelectedItemsList} onRenderFloatingPicker={BasicFloatingPicker} />,
        root
      ) as TypedBaseUnifiedPicker;

      if (picker.inputElement) {
        picker.inputElement.value = 'bl';
      }

      expect(picker.floatingPicker.current && picker.floatingPicker.current.isSuggestionsShown).toBeTruthy();
      picker.floatingPicker.current && picker.floatingPicker.current.hidePicker();
      expect(picker.floatingPicker.current && picker.floatingPicker.current.isSuggestionsShown).toBeFalsy();
      picker.floatingPicker.current && picker.floatingPicker.current.showPicker();
      expect(picker.floatingPicker.current && picker.floatingPicker.current.isSuggestionsShown).toBeTruthy();

      ReactDOM.unmountComponentAtNode(root);
    });

    it('Completes the suggestion', () => {
      const root = document.createElement('div');
      document.body.appendChild(root);

      const picker: TypedBaseUnifiedPicker = ReactDOM.render(
        <BaseUnifiedPickerWithType onRenderSelectedItems={BasicSelectedItemsList} onRenderFloatingPicker={BasicFloatingPicker} />,
        root
      ) as TypedBaseUnifiedPicker;

      if (picker.inputElement) {
        picker.inputElement.value = 'bl';
        ReactTestUtils.Simulate.keyDown(picker.inputElement, { which: KeyCodes.down });
      }

      picker.floatingPicker.current && picker.floatingPicker.current.completeSuggestion();
      expect(picker.selectedItemsList.current && picker.selectedItemsList.current.items.length).toBe(1);
      expect(picker.selectedItemsList.current && picker.selectedItemsList.current.items[0].name).toBe('blue');

      ReactDOM.unmountComponentAtNode(root);
    });
  });
});
