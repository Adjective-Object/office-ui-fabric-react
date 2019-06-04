import * as React from 'react';
import { Selection, SELECTION_CHANGE } from 'office-ui-fabric-react/lib/Selection';

import {
  ISelectedItemsList,
  IControlledSelectedItemListProps,
  IUncontrolledSelectedItemListProps,
  ISelectedItemsListProps,
  BaseSelectedItem
} from './SelectedItemsList.types';
import { copyToClipboard } from '../../utilities/copyToClipboard';
import { EventGroup } from '@uifabric/utilities/lib/EventGroup';

/**
 * Uses selection indeces as its own thing
 * @param selection the selection to get the indeces of as state.
 */
const useSelectionIndeces = (selection: Selection): number[] => {
  const [selectedIndices, setSelectedIndeces] = React.useState(selection.getSelectedIndices());

  React.useEffect(() => {
    const eventGroup = new EventGroup(null);
    eventGroup.on(selection, SELECTION_CHANGE, () => {
      setSelectedIndeces(selection.getSelectedIndices());
    });

    // Update state in effect only if the old selected indeces and the new
    // selected indeces don't match (e.g. we were fed a new selection)
    if (selection.getSelectedIndices() !== selectedIndices) {
      setSelectedIndeces(selection.getSelectedIndices());
    }

    //cleanup
    return () => {
      eventGroup.dispose();
    };
  }, [selection]);

  return selectedIndices;
};

/**
 * An externally-managed selected item list.
 */
const ControlledSelectedItemsList = <TItem extends BaseSelectedItem>(props: IControlledSelectedItemListProps<TItem>) => {
  const selectedIndeces = useSelectionIndeces(props.selection);
  // Synchronize the selection against the items in the selection
  React.useEffect(() => {
    props.selection.setItems(props.selectedItems);
  });

  const onRemoveItemCallbacks = React.useMemo(
    () =>
      // create callbacks ahead of time with memo.
      // (hooks have to be called in the same order)
      props.selectedItems.map((item: TItem) => () => props.onItemsRemoved([item])),
    [props.selectedItems]
  );

  const SelectedItem = props.onRenderItem;
  return (
    <>
      {props.selectedItems.map((item: TItem, index: number) => (
        <SelectedItem
          item={item}
          index={index}
          key={item.key !== undefined ? item.key : index}
          selected={selectedIndeces.indexOf(index) !== -1}
          removeButtonAriaLabel={props.removeButtonAriaLabel}
          onRemoveItem={onRemoveItemCallbacks[index]}
          onItemChange={props.onItemChange}
        />
      ))}
    </>
  );
};

/**
 * A self-managed selected item list.
 */
const UncontrolledSelectedItemsList = React.forwardRef(
  <TItem extends BaseSelectedItem>(props: IUncontrolledSelectedItemListProps<TItem>, ref: React.Ref<ISelectedItemsList<TItem>>) => {
    const [items, updateItems] = React.useState(props.defaultSelectedItems || []);
    const selection = React.useMemo(() => props.selection || new Selection(), [props.selection]);
    const selectedIndices = useSelectionIndeces(selection);

    // Selection which initializes at the beginning of the component and
    // only updates if seleciton becomes set in props (e.g. compoennt transitions from
    // being controlled to uncontrolled)
    const itemsInSelection = React.useMemo(() => selectedIndices.filter(i => i > 0 && i < items.length).map(i => items[i]), [
      items,
      selectedIndices
    ]);

    const removeItems = React.useCallback(
      (itemsToRemove: TItem[]): void => {
        updateItems(items.filter(item => itemsToRemove.indexOf(item) === -1));
      },
      [items]
    );

    const replaceItem = React.useCallback(
      (newItem: TItem | TItem[], index: number): void => {
        const newItemsArray = !Array.isArray(newItem) ? [newItem] : newItem;

        if (index >= 0) {
          const newItems: TItem[] = [...items];
          newItems.splice(index, 1, ...newItemsArray);
          updateItems(newItems);
        }
      },
      [updateItems, items]
    );

    // Callbacks only used in the imperative handle
    const copyItemsInSelectionToClipboard = React.useCallback((): void => {
      if (props.getItemCopyText && selectedIndices.length > 0) {
        const copyText = props.getItemCopyText(itemsInSelection);
        copyToClipboard(copyText);
      }
    }, [itemsInSelection, selectedIndices]);

    const addItems = React.useCallback(
      (newItems: TItem[]) => {
        updateItems(items.concat(newItems));
      },
      [items]
    );

    const unselectAll = React.useCallback(() => {
      selection.setAllSelected(false);
    }, [items]);

    // For usage as a controlled component with a ref
    React.useImperativeHandle(
      ref,
      (): ISelectedItemsList<TItem> => ({
        items,
        itemsInSelection,
        addItems,
        unselectAll,
        removeItems,
        copyItemsInSelectionToClipboard
      }),
      [items, addItems]
    );

    return (
      <ControlledSelectedItemsList<TItem>
        // passthrough props
        getItemCopyText={props.getItemCopyText}
        onRenderItem={props.onRenderItem}
        removeButtonAriaLabel={props.removeButtonAriaLabel}
        canRemoveItem={props.canRemoveItem}
        // props that are internal to the uncontrolled component
        selection={selection}
        selectedItems={items}
        onItemsRemoved={removeItems}
        onItemChange={replaceItem}
      />
    );
  }
);

type UncontrolledSelectedItemsList<T extends BaseSelectedItem> = React.RefForwardingComponent<
  ISelectedItemsList<T>,
  IUncontrolledSelectedItemListProps<T>
>;

const isControlledSelectedItemList = <T extends BaseSelectedItem>(
  props: IControlledSelectedItemListProps<T> | IUncontrolledSelectedItemListProps<T>
): props is IControlledSelectedItemListProps<T> => (props as any).selectedItems !== undefined;

const _SelectedItemsList = <TItem extends BaseSelectedItem>(
  props: ISelectedItemsListProps<TItem>,
  ref: React.Ref<ISelectedItemsList<TItem>>
) => {
  // Generics are not preserved in higher-order functions. Here we cast the component to the specific
  // instance of the generic type we need here.
  //
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
  // but oufr currently runs on typescript 3.3.3
  const TypedUncontrolledSelectedItemsList = UncontrolledSelectedItemsList as React.ForwardRefExoticComponent<
    React.RefAttributes<ISelectedItemsList<TItem>> & React.PropsWithoutRef<IUncontrolledSelectedItemListProps<TItem>>
  >;

  if (isControlledSelectedItemList<TItem>(props)) {
    return <ControlledSelectedItemsList<TItem> {...props} />;
  } else {
    return <TypedUncontrolledSelectedItemsList ref={ref} {...props} />;
  }
};

// Typescript only respects unifying a generic type with a generic const _function_ of the same name for function types.
// In order to satisfy the type checker, here we lie about the type of the const so that it is still a generic function.
//
// This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4, but oufr currnetly runs on typescript 3.3.3
export type SelectedItemsList<TItem extends BaseSelectedItem> = React.Component<ISelectedItemsListProps<TItem>>;
export const SelectedItemsList = React.forwardRef(_SelectedItemsList) as (typeof _SelectedItemsList);
