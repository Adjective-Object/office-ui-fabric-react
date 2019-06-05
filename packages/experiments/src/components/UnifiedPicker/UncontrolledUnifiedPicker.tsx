import * as React from 'react';

import { IUncontrolledUnifiedPickerProps, IUncontrolledUnifiedPicker, IControlledUnifiedPicker } from './UnifiedPicker.types';
import { ControlledUnifiedPicker } from './ControlledUnifiedPicker';

export interface IUnifiedPickerState<T> {
  queryString: string | null;
  selectedItems: T[] | null;
  suggestionItems: T[] | null;
}

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
 */
export const UncontrolledUnifiedPicker = React.forwardRef(
  <TSelectedItem extends any, TSuggestedItem = TSelectedItem>(
    props: IUncontrolledUnifiedPickerProps<TSelectedItem, TSuggestedItem>,
    ref: React.Ref<IUncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem>>
  ) => {
    const { defaultSelectedItems, defaultQueryString, isQueryForceResolveable, processSelectedItem, createItemFromPasteData } = props;

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

    const onSuggestionSelected = React.useCallback(
      (item: TSuggestedItem): void => {
        const initialQueryString = queryString;
        const processedItem: TSelectedItem | PromiseLike<TSelectedItem> | null = processSelectedItem ? processSelectedItem(item) : item;

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

    const controlledComponentRef = React.useRef<IControlledUnifiedPicker<TSelectedItem, TSuggestedItem>>(null);
    const focusInput = React.useCallback(() => {
      controlledComponentRef.current && controlledComponentRef.current.focusInput();
    }, [controlledComponentRef]);

    // Imperative Handle
    React.useImperativeHandle(
      ref,
      () => ({
        focusInput,
        get value() {
          return selectedItems;
        }
      }),
      [focusInput, selectedItems]
    );

    return (
      <ControlledUnifiedPicker<TSelectedItem, TSuggestedItem>
        // state
        selectedItems={selectedItems}
        queryString={queryString}
        canAddItems={props.itemLimit === undefined || selectedItems.length < props.itemLimit}
        // state manipulation callbacks
        onSelectedItemsRemoved={onSelectedItemsRemoved}
        onQueryStringChange={updateQueryString}
        // Styling props
        className={props.className}
        theme={props.theme}
        disabled={props.disabled}
        styles={props.styles}
        // This prop bag should be DI'd out
        inputProps={props.inputProps}
        // Render props
        onRenderFocusZone={props.onRenderFocusZone}
        onRenderSelectedItems={props.onRenderSelectedItems}
        onRenderFloatingSuggestions={props.onRenderFloatingSuggestions}
        // ---
        onPaste={onPaste}
        isQueryForceResolveable={isQueryForceResolveable}
        onSuggestionSelected={onSuggestionSelected}
      />
    );
  }
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TSelectedItem extends any, TSuggestedItem = TSelectedItem>(
  props: IUncontrolledUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
    React.RefAttributes<IUncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem>>
) => React.ReactElement;
export type UncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem> = (
  props: IUncontrolledUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
    React.RefAttributes<IUncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem>>
) => React.ReactElement;
