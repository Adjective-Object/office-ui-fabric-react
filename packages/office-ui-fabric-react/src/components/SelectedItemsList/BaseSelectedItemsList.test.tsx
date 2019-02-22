/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
/* tslint:enable:no-unused-variable */
import * as renderer from 'react-test-renderer';

import { IBaseSelectedItemsListProps, ISelectedItemProps } from './BaseSelectedItemsList.types';
import { BaseSelectedItemsList } from './BaseSelectedItemsList';

export interface ISimple {
  key: string;
  name: string;
}

const basicItemRenderer = (props: ISelectedItemProps<ISimple>) => {
  return <div key={props.key}> {props.name} </div>;
};

export type TypedBaseSelectedItemsList = BaseSelectedItemsList<ISimple, IBaseSelectedItemsListProps<ISimple>>;

describe('SelectedItemsList', () => {
  describe('BaseSelectedItemsList', () => {
    const BaseSelectedItemsListWithType: new (props: IBaseSelectedItemsListProps<ISimple>) => BaseSelectedItemsList<
      ISimple
    > = BaseSelectedItemsList;

    it('renders BaseSelectedItemsList correctly', () => {
      const component = renderer.create(<BaseSelectedItemsListWithType />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('can remove items', () => {
      const root = document.createElement('div');

      const onChange = (items: ISimple[] | undefined): void => {
        expect(items!.length).toBe(1);
        expect(items![0].name).toBe('b');
      };

      // use React.createElement instead of JSX so that this is typesafe.
      // (JSX Factories only return JSX.Element independent of the factory's return type.)
      // See https://github.com/Microsoft/TypeScript/issues/21699#issuecomment-423276533 for details.
      const itemsList: TypedBaseSelectedItemsList = ReactDOM.render<IBaseSelectedItemsListProps<ISimple>, TypedBaseSelectedItemsList>(
        React.createElement(BaseSelectedItemsListWithType, {
          onRenderItem: basicItemRenderer,
          selectedItems: [{ key: '1', name: 'a' }, { key: '2', name: 'b' }],
          onChange: onChange
        }),
        root
      );

      expect(itemsList.items.length).toEqual(2);
      itemsList.removeItemAt(0);
    });

    it('can remove items based on the removeItem callback', () => {
      const root = document.createElement('div');

      let onRemoveItemCallback: (() => void) | null = null;
      const trackedItemRenderer = (props: ISelectedItemProps<ISimple>) => {
        onRemoveItemCallback = props.onRemoveItem || null;
        return basicItemRenderer(props);
      };

      // use React.createElement instead of JSX so that this is typesafe.
      // (JSX Factories only return JSX.Element independent of the factory's return type.)
      // See https://github.com/Microsoft/TypeScript/issues/21699#issuecomment-423276533 for details.
      const itemsList: TypedBaseSelectedItemsList = ReactDOM.render<IBaseSelectedItemsListProps<ISimple>, TypedBaseSelectedItemsList>(
        React.createElement(BaseSelectedItemsListWithType, {
          onRenderItem: trackedItemRenderer,
          selectedItems: [{ key: '1', name: 'a' }]
        }),
        root
      );

      // Precondition check
      expect(itemsList.items.length).toEqual(1);
      expect(onRemoveItemCallback).not.toBeNull();

      // Act
      if (onRemoveItemCallback !== null) {
        // the type checker thinks that onRemoveItemCallback is `never` here because it
        // doesnt register the assignment effect in trackedItemRenderer.
        const callback: () => void = onRemoveItemCallback;
        callback();
      }

      expect(itemsList.items.length).toEqual(0);
    });

    it('can add items', () => {
      const root = document.createElement('div');
      const itemsList: TypedBaseSelectedItemsList = ReactDOM.render(
        <BaseSelectedItemsListWithType onRenderItem={basicItemRenderer} />,
        root
      ) as TypedBaseSelectedItemsList;

      const items: ISimple[] = [{ key: '1', name: 'a' }, { key: '2', name: 'b' }];
      itemsList.addItems(items);

      expect(itemsList.items.length).toEqual(2);
    });
  });
});
