import * as React from 'react';
import { IInputProps } from 'office-ui-fabric-react/lib/Pickers';
import { IFloatingSuggestionsProps, IFloatingSuggestions } from '../../FloatingSuggestions/FloatingSuggestions.types';
import { IControlledSelectedItemListProps } from '../../SelectedItemsList/SelectedItemsList.types';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { IFocusZoneProps } from 'office-ui-fabric-react/lib/FocusZone';
import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { IUnifiedPickerViewProps } from '../UnifiedPicker.types';

/**
 * The slice of props that the unified picker will pass to the
 * implementing floating picker component
 */
export type DefaultUnifiedPickerViewFloatingPickerProps<T> = Pick<
  IFloatingSuggestionsProps<T> & React.RefAttributes<IFloatingSuggestions<T>>,
  'onSuggestionSelected' | 'inputElement' | 'isQueryForceResolveable' | 'componentRef'
>;

/**
 * The slice of props that the unified picker will pass to the
 * implementing selected items component
 */
export type DefaultUnifiedPickerViewSelectedItemsProps<T> = NonNullable<
  Pick<IControlledSelectedItemListProps<T>, 'selection' | 'selectedItems' | 'onItemsRemoved' | 'onItemChange' | 'componentRef'>
>;

/**
 * tge slice of props that the unified picker will pass to the
 * implementing focusZone component
 */
export type DefaultUnifiedPickerViewFocusZoneProps = Pick<
  IFocusZoneProps,
  'direction' | 'onKeyDown' | 'onCopy' | 'className' | 'componentRef'
>;

/**
 * Ref to the controlled unified picker
 */
export interface IDefaultUnifiedPickerView<TSelectedItem, TSuggestedItem> {
  /** Sets focus to the input. */
  focusInput: () => void;
}

/**
 * Props from the DefaultUnifiedPickerView that are passed in by ComposingUnifiedPicker.
 */
export interface IDefaultUnifiedPickerViewPassthroughProps {
  className?: string;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<IDefaultUnifiedPickerViewStyleProps, IDefaultUnifiedPickerViewStyles>;

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
 * Props of the unified picker that are relevant to styles.
 *
 * Wrapping components can just pass these props through to the UnifiedPicker.
 */
export type IDefaultUnifiedPickerViewProps<TSelectedItem, TSuggestedItem> = IDefaultUnifiedPickerViewPassthroughProps &
  IUnifiedPickerViewProps<TSelectedItem, TSuggestedItem> & {
    /**
     * Autofill input native props
     * @defaultvalue undefined
     */
    inputProps?: IInputProps;

    /**
     * Function that specifies how the focus zone wrapping the whole component should render.
     */
    onRenderFocusZone?: React.ComponentType<DefaultUnifiedPickerViewFocusZoneProps>;

    /**
     * Function that specifies how the selected item list will appear.
     */
    onRenderSelectedItems: React.ComponentType<DefaultUnifiedPickerViewSelectedItemsProps<TSelectedItem>>;

    /**
     * Function that specifies how the floating picker will appear.
     */
    onRenderFloatingSuggestions: React.ComponentType<DefaultUnifiedPickerViewFloatingPickerProps<TSuggestedItem>>;

    /**
     * If the current query can be force resolved.
     *
     * TODO this should probably be a boolean on the controlled component.
     */
    isQueryForceResolveable?: (query: string) => boolean;
  };

/**
 * Input to generate styles for a unified picker
 */
export interface IDefaultUnifiedPickerViewStyleProps {
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
export interface IDefaultUnifiedPickerViewStyles {
  /** Root element of any picker extending from BasePicker (wraps all the elements). */
  root: IStyle;

  /** Refers to the wrapper of the elements already selected along with the input to type new selection. */
  pickerWell: IStyle;

  /** Refers to the input were to type new selections(picks). */
  input: IStyle;

  /** Refers to helper element used for accessibility tools (hidden from view on screen). */
  screenReaderText: IStyle;
}
