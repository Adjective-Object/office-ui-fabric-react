import * as React from 'react';
import { Autofill } from 'office-ui-fabric-react/lib/Autofill';
import { IInputProps } from 'office-ui-fabric-react/lib/Pickers';
import { IBaseFloatingPickerProps } from 'office-ui-fabric-react/lib/FloatingPicker';
import { IBaseSelectedItemsListProps } from 'office-ui-fabric-react/lib/SelectedItemsList';
import { IRefObject, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { IFocusZoneProps } from 'office-ui-fabric-react/lib/FocusZone';
import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';

/**
 * The slice of props that the unified picker will pass to the
 * implementing floating picker component
 */
export type UnifiedPickerFloatingPickerProps<T> = Pick<
  IBaseFloatingPickerProps<T>,
  'componentRef' | 'onChange' | 'inputElement' | 'selectedItems' | 'suggestionItems'
>;

/**
 * The slice of props that the unified picker will pass to the
 * implementing selected items component
 */
export type UnifiedPickerSelectedItemsProps<T> = NonNullable<
  Pick<IBaseSelectedItemsListProps<T>, 'selection' | 'selectedItems' | 'onRenderItem' | 'componentRef' | 'onItemsDeleted'>
>;

/**
 * tge slice of props that the unified picker will pass to the
 * implementing focusZone component
 */
export type UnifiedPickerFocusZoneProps = Pick<IFocusZoneProps, 'direction' | 'onKeyDown' | 'onCopy' | 'className'>;

export interface IUnifiedPicker<T> {
  /** Forces the picker to resolve */
  forceResolve?: () => void;
  /** Gets the current value of the input. */
  value: T[] | undefined;
  /** Sets focus to the input. */
  focus: () => void;
}

// Type T is the type of the item that is displayed
// and searched for by the people picker. For example, if the picker is
// displaying persona's than type T could either be of Persona or Ipersona props
export interface IUnifiedPickerProps<T> extends IUnifiedPickerComponentPassthroughProps {
  /**
   * Ref of the component
   */
  componentRef?: IRefObject<IUnifiedPicker<T>>;

  /**
   * Header/title element for the picker
   */
  headerComponent?: JSX.Element;

  /**
   * Initial items that have already been selected and should appear in the people picker.
   */
  defaultSelectedItems?: T[];

  /**
   * A callback for when the selected list of items changes.
   */
  onChange?: (items?: T[]) => void;

  /**
   * A callback for when text is pasted into the input
   */
  onPaste?: (pastedText: string) => T[];

  /**
   * A callback for when the user put focus on the picker
   */
  onFocus?: React.FocusEventHandler<HTMLInputElement | Autofill>;

  /**
   * A callback for when the user moves the focus away from the picker
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement | Autofill>;

  /**
   * Function that specifies how the floating picker will appear.
   */
  onRenderFloatingPicker: React.ComponentType<UnifiedPickerFloatingPickerProps<T>>;

  /**
   * Function that specifies how the selected item list will appear.
   */
  onRenderSelectedItems: React.ComponentType<UnifiedPickerSelectedItemsProps<T>>;

  /**
   * Autofill input native props
   * @defaultvalue undefined
   */
  inputProps?: IInputProps;

  /**
   * Restrict the amount of selectable items.
   * @defaultvalue undefined
   */
  itemLimit?: number;

  /**
   * A callback to process a selection after the user selects a suggestion from the picker.
   * The returned item will be added to the selected items list
   */
  onItemSelected?: (selectedItem?: T) => T | PromiseLike<T>;

  /**
   * A callback on when an item was added to the selected item list
   */
  onItemAdded?: (addedItem: T) => void;

  /**
   * A callback on when an item or items were removed from the selected item list
   */
  onItemsRemoved?: (removedItems: T[]) => void;

  /**
   * If using as a controlled component use selectedItems here instead of the SelectedItemsList
   */
  selectedItems?: T[];

  /**
   * If using as a controlled component use suggestionItems here instead of FloatingPicker
   */
  suggestionItems?: T[];

  /**
   * Focus zone props
   */
  onRenderFocusZone?: React.ComponentType<UnifiedPickerFocusZoneProps>;

  /**
   * Current rendered query string that's corealte to current rendered result
   **/
  currentRenderedQueryString?: string;

  /**
   * If the current query can be force resolved.
   */
  isQueryForceResolveable?: (query: string) => boolean;
}

/**
 * Props of the unified picker that are relevant to styles
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
