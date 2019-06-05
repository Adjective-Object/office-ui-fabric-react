import * as React from 'react';
import { Selection, SELECTION_CHANGE } from 'office-ui-fabric-react/lib/Selection';

import {
  ISelectedItemsList,
  IControlledSelectedItemsList,
  IControlledSelectedItemListProps,
  IUncontrolledSelectedItemListProps,
  ISelectedItemsListProps,
  BaseSelectedItem
} from './SelectedItemsList.types';
import { copyToClipboard } from '../../utilities/copyToClipboard';
import { EventGroup } from '@uifabric/utilities/lib/EventGroup';
import { PropsOf } from '../UnifiedPicker/ComposingUnifiedPicker.types';

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
const ControlledSelectedItemsList = React.forwardRef(
  <TItem extends BaseSelectedItem>(props: IControlledSelectedItemListProps<TItem>, ref: React.Ref<IControlledSelectedItemsList>) => {
    const selectedIndices = useSelectionIndeces(props.selection);
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

    // only used in the imperitive handle
    const copyItemsInSelectionToClipboard = React.useCallback((): void => {
      if (props.getItemCopyText && selectedIndices.length > 0) {
        const itemsInSelection = selectedIndices.map(itemIndex => props.selectedItems[itemIndex]);
        const copyText = props.getItemCopyText(itemsInSelection);
        copyToClipboard(copyText);
      }
    }, [props.selectedItems, selectedIndices]);

    React.useImperativeHandle(
      ref,
      () => ({
        copyItemsInSelectionToClipboard
      }),
      [copyItemsInSelectionToClipboard]
    );

    const SelectedItem = props.onRenderItem;
    return (
      <>
        {props.selectedItems.map((item: TItem, index: number) => (
          <SelectedItem
            item={item}
            index={index}
            key={item.key !== undefined ? item.key : index}
            selected={selectedIndices.indexOf(index) !== -1}
            removeButtonAriaLabel={props.removeButtonAriaLabel}
            onRemoveItem={onRemoveItemCallbacks[index]}
            onItemChange={props.onItemChange}
          />
        ))}
      </>
    );
  }
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TItem extends BaseSelectedItem>(
  props: IControlledSelectedItemListProps<TItem> & React.RefAttributes<IControlledSelectedItemsList>
) => React.ReactElement;
export type ControlledSelectedItemsList<TItem extends BaseSelectedItem> = (
  props: IControlledSelectedItemListProps<TItem> & React.RefAttributes<IControlledSelectedItemsList>
) => React.ReactElement;
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
    const addItems = React.useCallback(
      (newItems: TItem[]) => {
        updateItems(items.concat(newItems));
      },
      [items]
    );

    const unselectAll = React.useCallback(() => {
      selection.setAllSelected(false);
    }, [items]);

    const controlledRef = React.useRef<IControlledSelectedItemsList>(null);
    const copyItemsInSelectionToClipboard = React.useCallback(() => {
      controlledRef.current && controlledRef.current.copyItemsInSelectionToClipboard();
    }, [controlledRef]);

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
      [items, itemsInSelection, addItems, unselectAll, removeItems, copyItemsInSelectionToClipboard]
    );

    return (
      <ControlledSelectedItemsList<TItem>
        ref={controlledRef}
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
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TItem extends BaseSelectedItem>(
  props: IUncontrolledSelectedItemListProps<TItem> & React.RefAttributes<ISelectedItemsList<TItem>>
) => React.ReactElement;
export type UncontrolledSelectedItemsList<TItem extends BaseSelectedItem> = (
  props: IUncontrolledSelectedItemListProps<TItem> & React.RefAttributes<ISelectedItemsList<TItem>>
) => React.ReactElement;

const isControlledSelectedItemList = <T extends BaseSelectedItem>(
  props: IControlledSelectedItemListProps<T> | IUncontrolledSelectedItemListProps<T>
): props is IControlledSelectedItemListProps<T> => (props as any).selectedItems !== undefined;

export const SelectedItemsList = React.forwardRef(
  <TItem extends BaseSelectedItem>(props: ISelectedItemsListProps<TItem>, ref: React.Ref<ISelectedItemsList<TItem>>) => {
    if (isControlledSelectedItemList<TItem>(props)) {
      return <ControlledSelectedItemsList<TItem> ref={ref} {...props} />;
    } else {
      return <UncontrolledSelectedItemsList<TItem> ref={ref} {...props} />;
    }
  }
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <T>(props: PropsOf<UncontrolledSelectedItemsList<T>> | PropsOf<ControlledSelectedItemsList<T>>) => React.ReactElement;
export type SelectedItemsList<TItem extends BaseSelectedItem> = ControlledSelectedItemsList<TItem> | UncontrolledSelectedItemsList<TItem>;
