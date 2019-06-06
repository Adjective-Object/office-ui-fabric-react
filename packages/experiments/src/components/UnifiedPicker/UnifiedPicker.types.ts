import * as React from 'react';
import { Autofill } from 'office-ui-fabric-react/lib/Autofill';

/**
 * Ref to the uncontrolled unified picker
 */
export interface IUnifiedPicker<TSelectedItem, TSuggestedItem, TViewRefTarget> {
  /** Gets the current value of the input. */
  value: TSelectedItem[];
  /**
   * Gets the current value of the query string in the picker
   */
  queryString: string;
  /** Ref to the view of the picker */
  view: React.RefObject<TViewRefTarget>;
}

type ProcessSelectedItem<TSelectedItem, TSuggestedItem> = {
  /**
   * A callback to process a selection after the user selects a suggestion from the picker.
   * The returned item will be added to the selected items list
   *
   * @default identity
   */
  processSelectedItem?: (selectedItem?: TSuggestedItem) => TSelectedItem | PromiseLike<TSelectedItem>;
};

/**
 * Props passed to the unified picker
 */
export type IUnifiedPickerProps<TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any> = {
  /**
   * Renders the current state of the unified picker
   */
  view: React.ComponentType<IUnifiedPickerViewProps<TSelectedItem, TSuggestedItem> & React.RefAttributes<TViewRefTarget>>;

  /**
   * Initial items that have already been selected and should appear in the people picker.
   */
  defaultSelectedItems?: TSelectedItem[];

  /**
   * Initial query string in the input well.
   */
  defaultQueryString?: string;

  /**
   * A callback for when the selected list of items changes.
   */
  onChange?: (items?: TSelectedItem[]) => void;

  /**
   * Convert a pasted item to a new value
   */
  createItemFromPasteData?: (pasteData: DataTransfer) => TSelectedItem | PromiseLike<TSelectedItem>;

  /**
   * Restrict the amount of selectable items.
   * @defaultvalue undefined
   */
  itemLimit?: number;
  // ProcessSelectedItem is optional if the consumer
  // has a suggested item type that is assignable to
  // the selected item type.
} & (TSelectedItem extends TSuggestedItem
  ? ProcessSelectedItem<TSelectedItem, TSuggestedItem>
  : Required<ProcessSelectedItem<TSelectedItem, TSuggestedItem>>);

/**
 * Props passed to the unified picker's view.
 */
export interface IUnifiedPickerViewProps<TSelectedItem, TSuggestedItem = TSelectedItem, TViewRefTarget = any> {
  /**
   * The current query string
   */
  queryString: string;

  /**
   * The list of items that has been selected so far
   */
  selectedItems: TSelectedItem[];

  /**
   * Whether or not items can be added to the well.
   *
   * Dictates if the input field and floating suggestions will be rendered
   */
  canAddItems: boolean;

  /**
   * Callback for when a selected item is removed from the well
   */
  onSelectedItemsRemoved: (removedItems: TSelectedItem[]) => void;

  /**
   * Callback for when the query string is updated
   */
  onQueryStringChange: (newValue: string) => void;

  /**
   * Callback for when something is pasted into the input well of the picker
   */
  onPaste: (ev: React.ClipboardEvent<Autofill | HTMLInputElement>) => void;

  /**
   * Callback for when an item is selected from the suggestions in the picker
   */
  onSuggestionSelected: (item: TSuggestedItem) => void;
}
