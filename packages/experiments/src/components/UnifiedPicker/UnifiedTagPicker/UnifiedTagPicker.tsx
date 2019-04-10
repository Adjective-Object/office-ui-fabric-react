import * as React from 'react';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { DefaultPickerFooterItems } from '../DefaultPickerFooterItems';
import { UnifiedPickerSelectedItemsProps, UnifiedPickerFloatingPickerProps } from '../UnifiedPicker.types';
import { FloatingSuggestions, SuggestionsStore, IFloatingSuggestionsInnerSuggestionProps } from '../../FloatingSuggestions';
import { SelectedPeopleList, EditingItemFloatingPickerProps } from 'office-ui-fabric-react/lib/SelectedItemsList';
import { SuggestionsControl } from '../../FloatingSuggestions';
import { UnifiedPicker, UnifiedPickerImpl } from '../UnifiedPicker';
import { UnifiedTagPickerProps } from './UnifiedTagPicker.types';
import {
  ComposableSuggestionControl,
  ComposableMainFloatingPicker,
  ComposableEditingItemFloatingPicker,
  PropsOf
} from '../ComposingUnifiedPicker.types';
import { DefaultTagPickerSuggestion } from './defaults/DefaultTagPickerSuggestion';

/**
 * Attep
 */
export class UnifiedTagPicker<TTag extends ITag> extends React.PureComponent<UnifiedTagPickerProps<TTag>> {
  private _picker: UnifiedPickerImpl<TTag>;
  // Custom footer items that reflect the state of the picker.
  private _defaultFooterItems: DefaultPickerFooterItems = new DefaultPickerFooterItems();

  constructor(props: UnifiedTagPickerProps<TTag>) {
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
        headerComponent={this.props.headerComponent}
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
  private DefaultSuggestionControlInner: ComposableSuggestionControl<TTag> = (
    overriddenProps: PropsOf<ComposableSuggestionControl<TTag>>
  ) => (
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
  private SuggestionControl = (overriddenProps: IFloatingSuggestionsInnerSuggestionProps<TTag>) => {
    const Inner: ComposableSuggestionControl<TTag> = this.props.onRenderSuggestionControl || this.DefaultSuggestionControlInner;
    return <Inner onRenderSuggestion={this.props.onRenderSuggestionItem} {...overriddenProps} />;
  };

  /**
   * The floating picker that is used by default for both the
   * floating picker suggestion dropdown and the suggestion well floating picker.
   */
  private DefaultFloatingPickerInner: ComposableMainFloatingPicker<TTag> = (
    overriddenProps: PropsOf<ComposableMainFloatingPicker<TTag>> | PropsOf<ComposableEditingItemFloatingPicker<TTag>>
  ) => (
    <FloatingSuggestions
      suggestionsStore={new SuggestionsStore<TTag>()}
      onResolveSuggestions={this.props.onResolveSuggestions}
      getTextFromItem={this._getTextFromItem}
      onRemoveSuggestion={this.props.onRemoveSuggestion}
      onZeroQuerySuggestion={this.props.onZeroQuerySuggestion}
      isQueryForceResolveable={this.props.isQueryForceResolveable}
      onRenderSuggestionsItem={this.props.onRenderSuggestionItem || DefaultTagPickerSuggestion}
      {...overriddenProps}
    />
  );

  /**
   * Renders the floating picker for the main input.
   * Uses the default picker if none is provided.
   */
  private MainFloatingPicker = (overriddenProps: UnifiedPickerFloatingPickerProps<TTag>) => {
    const Inner: ComposableMainFloatingPicker<TTag> = this.props.onRenderMainFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.SuggestionControl} {...overriddenProps} />;
  };

  /**
   * Renders the floating picker for the editing item.
   * Uses the default picker if none is provided.
   */
  private EditingItemFloatingPicker = (overriddenProps: EditingItemFloatingPickerProps<TTag>) => {
    const Inner: ComposableEditingItemFloatingPicker<TTag> =
      this.props.onRenderEditingItemFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.SuggestionControl} {...overriddenProps} />;
  };

  /**
   * the default selected items list
   */
  private DefaultSelectedItemsList = (overriddenProps: UnifiedPickerSelectedItemsProps<TTag>) => (
    <SelectedPeopleList
      onCopyItems={this._getDefaultCopyItemText}
      onExpandGroup={this.props.onExpandSelectedItem}
      removeMenuItemText={'Remove'}
      copyMenuItemText={'Copy name'}
      editMenuItemText={'Edit'}
      getEditingItemText={this._getDefaultEditingItemText}
      onRenderFloatingPicker={this.EditingItemFloatingPicker}
      onRenderItem={this.props.onRenderSelectedItem}
      {...overriddenProps}
    />
  );

  /**
   * Default implementaion of copying personas of the current type out of the
   * suggestions well. Can be overridden by consuming components by overriding the SelectedPeopleList component.
   *
   * @param items the items to copy
   */
  private _getDefaultCopyItemText(items: TTag[]): string {
    let copyText = '';
    items.forEach((item: TTag, index: number) => {
      copyText += item.name;

      if (index < items.length - 1) {
        copyText += ', ';
      }
    });

    return copyText;
  }

  private _getDefaultEditingItemText(item: TTag): string {
    return item.name;
  }

  private _setComponentRef = (component: UnifiedPickerImpl<TTag>): void => {
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

  private _getTextFromItem(item: TTag): string {
    return item.name as string;
  }

  /**
   * If the suggestion remove buttons should be shown or nots
   *
   * Show if we control the data model
   */
  private _shouldShowSuggestionRemoveButtons() {
    return this.props.onRemoveSuggestion !== undefined;
  }
}
