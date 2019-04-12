import * as React from 'react';
import { DefaultPickerFooterItems } from './DefaultPickerFooterItems';
import { UnifiedPickerSelectedItemsProps, UnifiedPickerFloatingPickerProps } from './UnifiedPicker.types';
import { FloatingSuggestions, SuggestionsStore, IFloatingSuggestionsInnerSuggestionProps } from './../FloatingSuggestions';
import { SelectedItemsList } from '../SelectedItemsList';
import { SuggestionsControl } from '../FloatingSuggestions';
import { UnifiedPicker, UnifiedPickerImpl } from '../UnifiedPicker';
import {
  ComposingUnifiedPickerProps,
  ComposableSuggestionControl,
  ComposableMainFloatingPicker,
  PropsOf
} from './ComposingUnifiedPicker.types';

/**
 * Attep
 */
export class ComposingUnifiedPicker<T> extends React.PureComponent<ComposingUnifiedPickerProps<T>> {
  private _picker: UnifiedPickerImpl<T>;
  // Custom footer items that reflect the state of the picker.
  private _defaultFooterItems: DefaultPickerFooterItems = new DefaultPickerFooterItems();

  constructor(props: ComposingUnifiedPickerProps<T>) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <UnifiedPicker
        onRenderFloatingPicker={this.MainFloatingPicker}
        onRenderSelectedItems={this.DefaultSelectedItemsList}
        onRenderFocusZone={this.props.onRenderFocusZone}
        key={'normal'}
        inputProps={{
          'aria-label': 'People Picker'
        }}
        componentRef={this._setComponentRef}
        // Styling props pasthrough
        className={this.props.className}
        styles={this.props.styles}
        disabled={this.props.disabled}
      />
    );
  }

  /**
   * the default selected items list
   */
  private DefaultSuggestionControlInner: ComposableSuggestionControl<T> = (overriddenProps: PropsOf<ComposableSuggestionControl<T>>) => (
    <SuggestionsControl
      showRemoveButtons={this._shouldShowSuggestionRemoveButtons()}
      headerItemsProps={[]}
      footerItemsProps={this._defaultFooterItems.items}
      shouldSelectFirstItem={this._inputIsNotEmpty}
      {...overriddenProps}
    />
  );

  /**
   * Renders the suggestion control that is passed to both the
   * main picker and the editing item picker.
   *
   * Uses the default suggestion control if none is provided.
   */
  private SuggestionControl = (overriddenProps: IFloatingSuggestionsInnerSuggestionProps<T>) => {
    const Inner: ComposableSuggestionControl<T> = this.props.onRenderSuggestionControl || this.DefaultSuggestionControlInner;
    return <Inner onRenderSuggestion={this.props.onRenderSuggestionItem} {...overriddenProps} />;
  };

  /**
   * The floating picker that is used by default for both the
   * floating picker suggestion dropdown and the suggestion well floating picker.
   */
  private DefaultFloatingPickerInner: ComposableMainFloatingPicker<T> = (overriddenProps: PropsOf<ComposableMainFloatingPicker<T>>) => (
    <FloatingSuggestions
      suggestionsStore={new SuggestionsStore<T>()}
      onResolveSuggestions={this.props.onResolveSuggestions}
      onRemoveSuggestion={this.props.onRemoveSuggestion}
      onZeroQuerySuggestion={this.props.onZeroQuerySuggestion}
      isQueryForceResolveable={this.props.isQueryForceResolveable}
      onRenderSuggestionsItem={this.props.onRenderSuggestionItem}
      {...overriddenProps}
    />
  );

  /**
   * Renders the floating picker for the main input.
   * Uses the default picker if none is provided.
   */
  private MainFloatingPicker = (overriddenProps: UnifiedPickerFloatingPickerProps<T>) => {
    const Inner: ComposableMainFloatingPicker<T> = this.props.onRenderMainFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.SuggestionControl} {...overriddenProps} />;
  };

  /**
   * the default selected items list
   */
  private DefaultSelectedItemsList = (overriddenProps: UnifiedPickerSelectedItemsProps<T>) => (
    <SelectedItemsList onRenderItem={this.props.onRenderSelectedItem} {...overriddenProps} />
  );

  private _setComponentRef = (component: UnifiedPickerImpl<T>): void => {
    this._picker = component;
    if (this.props.onRenderSuggestionControl === undefined) {
      // Only bind the default footer items to the component
      // if we are using the default suggestions control.
      this._defaultFooterItems.bindPickerInstance(this._picker);
    } else {
      // Clean up the reference otherwise
      this._defaultFooterItems.bindPickerInstance(undefined);
    }
  };

  private _inputIsNotEmpty = (): boolean => {
    return !(this._picker !== undefined && this._picker.inputElement !== null && this._picker.inputElement.value === '');
  };

  /**
   * If the suggestion remove buttons should be shown or nots
   *
   * Show if we control the data model
   */
  private _shouldShowSuggestionRemoveButtons() {
    return this.props.onRemoveSuggestion !== undefined;
  }
}
