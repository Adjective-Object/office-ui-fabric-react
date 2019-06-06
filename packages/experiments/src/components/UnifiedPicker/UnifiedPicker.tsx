import * as React from 'react';

import { IUnifiedPickerProps, IUnifiedPicker } from './UnifiedPicker.types';

function isPromiseLike<T>(r: T | PromiseLike<T>): r is PromiseLike<T> {
  return !!(r && (r as { then?: Function }).then);
}

const maybeAwait = <T extends any>(inputValue: T | PromiseLike<T>): PromiseLike<T> => {
  if (isPromiseLike(inputValue)) {
    return inputValue;
  }
  return {
    then: (callback: (value: T) => any) => callback(inputValue)
  };
};

/**
 * A state-only component that manages a UnifiedPicker's internal state
 *
 * (e.g. managing a list of items against consumer-provided hooks)
 *
 * Renders the view that is passed into it.
 */
export const UnifiedPicker = React.forwardRef(
  <TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any>(
    props: IUnifiedPickerProps<TSelectedItem, TSuggestedItem>,
    ref: React.Ref<IUnifiedPicker<TSelectedItem, TSuggestedItem, TViewRefTarget>>
  ) => {
    const { defaultSelectedItems, defaultQueryString, processSelectedItem, createItemFromPasteData } = props;

    const [selectedItems, setSelectedItems] = React.useState(defaultSelectedItems || []);
    const [queryString, updateQueryString] = React.useState(defaultQueryString || '');

    const onSelectedItemsRemoved = React.useCallback(
      (removedItems: TSelectedItem[]) => {
        console.log('unifiedPicker onSelectedItemsRemoved called', removedItems);
        // Update internal state if it is tracked at all
        const nextSelectedItems = selectedItems.filter(i => removedItems.indexOf(i) === -1);
        if (nextSelectedItems.length !== selectedItems.length - removedItems.length) {
          console.error('UnifiedPicker onSelectedItemsRemoved called on some item not in the current state');
        }
        setSelectedItems(nextSelectedItems);
      },
      [selectedItems]
    );

    const onSelectedItemChanged = React.useCallback(
      (newItem: TSelectedItem | TSelectedItem[], index: number): void => {
        const newItemsArray = !Array.isArray(newItem) ? [newItem] : newItem;

        if (index >= 0) {
          const newItems: TSelectedItem[] = [...selectedItems];
          newItems.splice(index, 1, ...newItemsArray);
          setSelectedItems(newItems);
        }
      },
      [setSelectedItems, selectedItems]
    );
    const onSuggestionSelected = React.useCallback(
      (item: TSuggestedItem): void => {
        const initialQueryString = queryString;
        const processedItem: TSelectedItem | PromiseLike<TSelectedItem> | null = processSelectedItem
          ? processSelectedItem(item)
          : // procesSelectedItem is only optional if
            // TsuggestedItem is assignable to TSuggestedItem
            ((item as unknown) as TSelectedItem);

        processedItem &&
          maybeAwait(processedItem).then(newItem => {
            // Only actually select the item if the query string hasn't changed since
            // we started resolving the item.
            //
            // This is to handle the case where a user types quickly and presses enter
            // before updating the query string
            if (initialQueryString === queryString) {
              setSelectedItems(selectedItems.concat([newItem]));
            }
          });
        if (processedItem === null) {
          return;
        }
      },
      [queryString, processSelectedItem, selectedItems, setSelectedItems]
    );

    const onPaste = React.useCallback(
      (event: React.ClipboardEvent<any>): void => {
        if (createItemFromPasteData) {
          event.preventDefault();

          const pastedItem: TSelectedItem | PromiseLike<TSelectedItem> = createItemFromPasteData(event.clipboardData);
          pastedItem &&
            maybeAwait(pastedItem).then(newItem => {
              setSelectedItems(selectedItems.concat([newItem]));
            });
        }
      },
      [createItemFromPasteData, selectedItems, setSelectedItems]
    );

    const viewRef = React.useRef<TViewRefTarget>(null);

    // Imperative Handle
    React.useImperativeHandle(
      ref,
      () => ({
        view: viewRef,
        get value() {
          return selectedItems;
        },
        get queryString() {
          return queryString;
        }
      }),
      [viewRef, selectedItems, queryString]
    );

    const View = props.view;
    return (
      <View
        componentRef={viewRef}
        // state
        selectedItems={selectedItems}
        queryString={queryString}
        canAddItems={props.itemLimit === undefined || selectedItems.length < props.itemLimit}
        // state manipulation callbacks
        onSelectedItemsRemoved={onSelectedItemsRemoved}
        onSelectedItemChanged={onSelectedItemChanged}
        onQueryStringChange={updateQueryString}
        onPaste={onPaste}
        onSuggestionSelected={onSuggestionSelected}
      />
    );
  }
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any>(
  props: IUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
    React.RefAttributes<IUnifiedPicker<TSelectedItem, TSuggestedItem, TViewRefTarget>>
) => React.ReactElement;
export type UnifiedPicker<TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any> = (
  props: IUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
    React.RefAttributes<IUnifiedPicker<TSelectedItem, TSuggestedItem, TViewRefTarget>>
) => React.ReactElement;
(UnifiedPicker as any).displayName = 'UnifiedPicker';
