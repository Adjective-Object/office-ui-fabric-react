import * as React from 'react';
import { Autofill } from 'office-ui-fabric-react/lib/Autofill';
import { IInputProps } from 'office-ui-fabric-react/lib/Pickers';
import { IFloatingSuggestionsProps } from '../FloatingSuggestions/FloatingSuggestions.types';
import { IControlledSelectedItemListProps } from '../SelectedItemsList/SelectedItemsList.types';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { IFocusZoneProps } from 'office-ui-fabric-react/lib/FocusZone';
import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';

/**
 * The slice of props that the unified picker will pass to the
 * implementing floating picker component
 */
export type UnifiedPickerFloatingPickerProps<T> = Pick<
  IFloatingSuggestionsProps<T>,
  'onSuggestionSelected' | 'inputElement' | 'isQueryForceResolveable'
>;

/**
 * The slice of props that the unified picker will pass to the
 * implementing selected items component
 */
export type UnifiedPickerSelectedItemsProps<T> = NonNullable<
  Pick<IControlledSelectedItemListProps<T>, 'selection' | 'selectedItems' | 'onItemsRemoved'>
>;

/**
 * tge slice of props that the unified picker will pass to the
 * implementing focusZone component
 */
export type UnifiedPickerFocusZoneProps = Pick<IFocusZoneProps, 'direction' | 'onKeyDown' | 'onCopy' | 'className'>;

/**
 * Ref to the controlled unified picker
 */
export interface IControlledUnifiedPicker<TSelectedItem, TSuggestedItem> {
  /** Sets focus to the input. */
  focusInput: () => void;
}

/**
 * Ref to the uncontrolled unified picker
 */
export interface IUncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem> {
  /** Sets focus to the input. */
  focusInput: () => void;
  /** Forces the picker to resolve */
  forceResolve?: () => void;
  /** Gets the current value of the input. */
  value: TSelectedItem[];
}

/**
 * Props of the unified picker that are relevant to styles.
 *
 * Wrapping components can just pass these props through to the UnifiedPicker.
 */
export interface IUnifiedPickerComponentPassthroughProps {
  className?: string;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<IUnifiedPickerStyleProps, IUnifiedPickerStyles>;

  /**
   * Theme provided by High-Order Component.
   */
  theme?: ITheme;

  /**
   * Flag for disabling the picker.
   * @defaultvalue false
   */
  disabled?: boolean;
}

/**
 * Props common to the ControlledUnifiedPicker and UncontrolledUnifiedPicker
 */
export interface IUnifiedPickerCommonProps<TSelectedItem, TSuggestedItem = TSelectedItem> extends IUnifiedPickerComponentPassthroughProps {
  /**
   * Autofill input native props
   * @defaultvalue undefined
   */
  inputProps?: IInputProps;

  /**
   * Function that specifies how the focus zone wrapping the whole component should render.
   */
  onRenderFocusZone?: React.ComponentType<UnifiedPickerFocusZoneProps>;

  /**
   * Function that specifies how the selected item list will appear.
   */
  onRenderSelectedItems: React.ComponentType<UnifiedPickerSelectedItemsProps<TSelectedItem>>;

  /**
   * Function that specifies how the floating picker will appear.
   */
  onRenderFloatingSuggestions: React.ComponentType<UnifiedPickerFloatingPickerProps<TSuggestedItem>>;

  /**
   * If the current query can be force resolved.
   *
   * TODO this should probably be a boolean on the controlled component.
   */
  isQueryForceResolveable?: (query: string) => boolean;
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

export interface IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem = TSelectedItem>
  extends IUnifiedPickerCommonProps<TSelectedItem, TSuggestedItem> {
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

  /**
   * If the current query can be force resolved.
   */
  isQueryForceResolveable?: (query: string) => boolean;

  /**
   * Autofill input native props
   * @defaultvalue undefined
   */
  inputProps?: IInputProps;

  /**
   * Function that specifies how the focus zone wrapping the whole component should render.
   */
  onRenderFocusZone?: React.ComponentType<UnifiedPickerFocusZoneProps>;

  /**
   * Function that specifies how the selected item list will appear.
   */
  onRenderSelectedItems: React.ComponentType<UnifiedPickerSelectedItemsProps<TSelectedItem>>;

  /**
   * Function that specifies how the floating picker will appear.
   */
  onRenderFloatingSuggestions: React.ComponentType<UnifiedPickerFloatingPickerProps<TSuggestedItem>>;
}

export type IUncontrolledUnifiedPickerProps<TSelectedItem, TSuggestedItem = TSelectedItem> = IUnifiedPickerCommonProps<
  TSelectedItem,
  TSuggestedItem
> & {
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

export type IUnifiedPickerProps<TSelectedItem, TSuggestedItem = TSelectedItem> =
  | IUncontrolledUnifiedPickerProps<TSelectedItem, TSuggestedItem>
  | IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem>;

/**
 * Input to generate styles for a unified picker
 */
export interface IUnifiedPickerStyleProps {
  className?: string;
  disabled?: boolean;
  /**
   * Theme provided by styled() function.
   */
  theme?: ITheme;
}

/**
 * Generated styles for a unifiedPicker
 */
export interface IUnifiedPickerStyles {
  /** Root element of any picker extending from BasePicker (wraps all the elements). */
  root: IStyle;

  /** Refers to the wrapper of the elements already selected along with the input to type new selection. */
  pickerWell: IStyle;

  /** Refers to the input were to type new selections(picks). */
  input: IStyle;

  /** Refers to helper element used for accessibility tools (hidden from view on screen). */
  screenReaderText: IStyle;
}
