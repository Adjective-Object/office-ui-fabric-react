import * as React from 'react';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { DefaultPickerFooterItems } from '../DefaultPickerFooterItems';
import { UnifiedPickerSelectedItemsProps, UnifiedPickerFloatingPickerProps } from '../UnifiedPicker.types';
import { SuggestionsStore, FloatingPeoplePicker, BaseFloatingPickerSuggestionProps } from 'office-ui-fabric-react/lib/FloatingPicker';
import { SelectedPeopleList, EditingItemFloatingPickerProps } from 'office-ui-fabric-react/lib/SelectedItemsList';
import { SuggestionsControl } from 'office-ui-fabric-react/lib/FloatingPicker';
import { UnifiedPicker } from '../UnifiedPicker';
import {
  PropsOf,
  UnifiedPeoplePickerProps,
  ComposableSuggestionControl,
  ComposableMainFloatingPicker,
  ComposableEditingItemFloatingPicker
} from './UnifiedPeoplePicker.types';

// /**
//  * Purify a functional component
//  */
// function memo<TProps>(InnerComponent: React.StatelessComponent<TProps>): React.ComponentType<TProps> {
//   return class MemoizedFunctionalComponent extends React.PureComponent<TProps> {
//     public render() {
//       return <InnerComponent {...this.props} />;
//     }
//   };
// }

export class UnifiedPeoplePicker<TPersona extends IPersonaProps> extends React.PureComponent<UnifiedPeoplePickerProps<TPersona>> {
  private _picker: UnifiedPicker<TPersona>;
  // Custom footer items that reflect the state of the picker.
  private _defaultFooterItems: DefaultPickerFooterItems = new DefaultPickerFooterItems();

  constructor(props: UnifiedPeoplePickerProps<TPersona>) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <UnifiedPicker
        onRenderFloatingPicker={this.MainFloatingPicker}
        onRenderSelectedItems={this.DefaultSelectedPeopleList}
        onRenderFocusZone={this.props.onRenderFocusZone}
        className={css('ms-PeoplePicker', this.props.className)}
        key={'normal'}
        inputProps={{
          'aria-label': 'People Picker'
        }}
        componentRef={this._setComponentRef}
        headerComponent={this.props.headerComponent}
      />
    );
  }

  /**
   * the default selected items list
   */
  private DefaultSuggestionControlInner: ComposableSuggestionControl<TPersona> = (
    overriddenProps: PropsOf<ComposableSuggestionControl<TPersona>>
  ) => (
    <SuggestionsControl
      showRemoveButtons={this._shouldShowSuggestionRemoveButtons()}
      headerItemsProps={[]}
      footerItemsProps={this._defaultFooterItems.items}
      shouldSelectFirstItem={this._suggestionIsNotEmpty}
      {...overriddenProps}
    />
  );

  /**
   * Renders the suggestion control that is passed to both the
   * main picker and the editing item picker.
   *
   * Uses the default suggestion control if none is provided.
   */
  private SuggestionControl = (overriddenProps: BaseFloatingPickerSuggestionProps<TPersona>) => {
    const Inner: ComposableSuggestionControl<TPersona> = this.props.onRenderSuggestionControl || this.DefaultSuggestionControlInner;
    return <Inner onRenderSuggestion={this.props.onRenderSuggestionItem} {...overriddenProps} />;
  };

  /**
   * The floating picker that is used by default for both the
   * floating picker suggestion dropdown and the suggestion well floating picker.
   */
  private DefaultFloatingPickerInner: ComposableMainFloatingPicker<TPersona> = (
    overriddenProps: PropsOf<ComposableMainFloatingPicker<TPersona>> | PropsOf<ComposableEditingItemFloatingPicker<TPersona>>
  ) => (
    <FloatingPeoplePicker
      suggestionsStore={new SuggestionsStore<TPersona>()}
      onResolveSuggestions={this.props.onResolveSuggestions}
      getTextFromItem={this._getTextFromItem}
      onRemoveSuggestion={this.props.onRemoveSuggestion}
      onZeroQuerySuggestion={this.props.onZeroQuerySuggestion}
      showForceResolve={this.props.shouldShowForceResolveSuggestion}
      onValidateInput={this.props.onValidateInput}
      // Override the render suggestion item twice here.
      // TODO: fix this once FloatingPickers are switched to composition
      // isntead of inheritence.
      onRenderSuggestionsItem={this.props.onRenderSuggestionItem}
      {...overriddenProps}
    />
  );

  /**
   * Renders the floating picker for the main input.
   * Uses the default picker if none is provided.
   */
  private MainFloatingPicker = (overriddenProps: UnifiedPickerFloatingPickerProps<TPersona>) => {
    const Inner: ComposableMainFloatingPicker<TPersona> = this.props.onRenderMainFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.SuggestionControl} {...overriddenProps} />;
  };

  /**
   * Renders the floating picker for the editing item.
   * Uses the default picker if none is provided.
   */
  private EditingItemFloatingPicker = (overriddenProps: EditingItemFloatingPickerProps<TPersona>) => {
    const Inner: ComposableEditingItemFloatingPicker<TPersona> =
      this.props.onRenderEditingItemFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.SuggestionControl} {...overriddenProps} />;
  };

  /**
   * the default selected items list
   */
  private DefaultSelectedPeopleList = (overriddenProps: UnifiedPickerSelectedItemsProps<TPersona>) => (
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
  private _getDefaultCopyItemText(items: TPersona[]): string {
    let copyText = '';
    items.forEach((item: TPersona, index: number) => {
      copyText += item.text;

      if (index < items.length - 1) {
        copyText += ', ';
      }
    });

    return copyText;
  }

  private _getDefaultEditingItemText(item: TPersona): string {
    return item.text as string;
  }

  private _setComponentRef = (component: UnifiedPicker<TPersona>): void => {
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

  private _suggestionIsNotEmpty = (): boolean => {
    return !(this._picker !== undefined && this._picker.inputElement !== null && this._picker.inputElement.value === '');
  };

  private _getTextFromItem(persona: TPersona): string {
    return persona.text as string;
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
