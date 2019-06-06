import * as React from 'react';

import { IUnifiedPickerProps, IUnifiedPicker } from './UnifiedPicker.types';
import { useSelectedItemListState } from '../SelectedItemsList';

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
export const UnifiedPicker = React.memo(
  <TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any>(props: IUnifiedPickerProps<TSelectedItem, TSuggestedItem>) => {
    const { defaultSelectedItems, defaultQueryString, processSelectedItem, createItemFromPasteData, disabled } = props;
    const { selectedItems, setSelectedItems, appendSelectedItems, removeSelectedItems, replaceSelectedItem } = useSelectedItemListState(
      defaultSelectedItems
    );
    const [queryString, updateQueryString] = React.useState(defaultQueryString || '');

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
              console.log('insert. Clear qstring?');
              appendSelectedItems([newItem]);
              updateQueryString('');
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
      props.componentRef,
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
        // parent state
        disabled={disabled}
        // state
        selectedItems={selectedItems}
        queryString={queryString}
        canAddItems={props.itemLimit === undefined || selectedItems.length < props.itemLimit}
        // state manipulation callbacks
        onSelectedItemsRemoved={removeSelectedItems}
        onSelectedItemChanged={replaceSelectedItem}
        onQueryStringChange={updateQueryString}
        onPaste={onPaste}
        onSuggestionSelected={onSuggestionSelected}
      />
    );
  }
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any>(
  props: IUnifiedPickerProps<TSelectedItem, TSuggestedItem>
) => React.ReactElement;
export type UnifiedPicker<TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any> = (
  props: IUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
    React.RefAttributes<IUnifiedPicker<TSelectedItem, TSuggestedItem, TViewRefTarget>>
) => React.ReactElement;
(UnifiedPicker as any).displayName = 'UnifiedPicker';
