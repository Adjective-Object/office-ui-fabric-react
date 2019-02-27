import * as React from 'react';
import { css } from '../../../Utilities';
import { IPersonaProps } from '../../Persona/Persona.types';
import { UnifiedPicker } from '../UnifiedPicker';
import { IUnifiedPickerProps, UnifiedPickerSelectedItemsProps, UnifiedPickerFloatingPickerProps } from '../UnifiedPicker.types';
import { IEditingItemProps, EditingItemFloatingPickerProps } from '../../SelectedItemsList/SelectedPeopleList/Items/EditingItem';
import {
  SuggestionsStore,
  FloatingPeoplePicker,
  BaseFloatingPickerSuggestionProps,
  IBaseFloatingPickerProps,
  ISuggestionsControlProps
} from '../../FloatingPicker/index';
import { SelectedPeopleList, ISelectedPeopleProps } from '../../SelectedItemsList/SelectedPeopleList/SelectedPeopleList';
import { SuggestionsControl } from '../../FloatingPicker/Suggestions/SuggestionsControl';

export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;
export type WithMoreProps<TComponent extends React.ComponentType, TMoreProps> = React.ComponentType<PropsOf<TComponent> & TMoreProps>;

/**
 * Expand the exact floating picker props that are passed through from the UnifiedPicker
 * so that if FloatingPicker is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableMainFloatingPicker<T> = WithMoreProps<
  IUnifiedPickerProps<T>['onRenderFloatingPicker'],
  Pick<IBaseFloatingPickerProps<T>, 'onRenderSuggestionControl'>
>;

/**
 * Expand the exact floating picker props that are passed through from the UnifiedPicker
 * so that if FloatingPicker is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableEditingItemFloatingPicker<T> = WithMoreProps<
  NonNullable<IEditingItemProps<T>['onRenderFloatingPicker']>,
  Pick<IBaseFloatingPickerProps<T>, 'onRenderSuggestionControl'>
>;

/**
 * Expand the exact suggestion control props that are passed through from the FloatingPicker
 * so that if SuggestionControl is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableSuggestionControl<T> = React.ComponentType<
  BaseFloatingPickerSuggestionProps<T> & Pick<ISuggestionsControlProps<T>, 'onRenderSuggestion'>
>;

export type UnifiedPeoplePickerProps<TPersona extends IPersonaProps> = {
  /**
   * Passed down to UnifiedPeoplePicker div. Required for fabric compliance.
   */
  className?: string;

  /////////////////////////////////////
  // Coordinated Internal Components //
  /////////////////////////////////////
  headerComponent?: IUnifiedPickerProps<TPersona>['headerComponent'];
  onRenderFocusZone?: IUnifiedPickerProps<TPersona>['onRenderFocusZone'];
  onRenderMainFloatingPicker?: ComposableMainFloatingPicker<TPersona>;
  onRenderEditingItemFloatingPicker?: ComposableEditingItemFloatingPicker<TPersona>;
  onRenderSuggestionControl?: ComposableSuggestionControl<TPersona>;
  onRenderSuggestionItem?: ISuggestionsControlProps<TPersona>['onRenderSuggestion'];

  ///////////////////////////
  // Data Model (required) //
  ///////////////////////////
  onResolveSuggestions: IBaseFloatingPickerProps<TPersona>['onResolveSuggestions'];

  //////////////////////////////////////
  // Customizable Behavior (optional) //
  //////////////////////////////////////
  onValidateInput?: IBaseFloatingPickerProps<TPersona>['onValidateInput'];
  onZeroQuerySuggestion?: IBaseFloatingPickerProps<TPersona>['onZeroQuerySuggestion'];
  shouldShowForceResolveSuggestion?: IBaseFloatingPickerProps<TPersona>['showForceResolve'];
  onExpandSelectedItem?: ISelectedPeopleProps<TPersona>['onExpandGroup'];

  /////////////////////////////////////////////
  // Props for use as a controlled component //
  // TODO: write a wrapper component that    //
  // manages state for use as uncontrolled   //
  /////////////////////////////////////////////
  onRemoveSuggestion?: IBaseFloatingPickerProps<TPersona>['onRemoveSuggestion'];
};

export class UnifiedPeoplePicker<TPersona extends IPersonaProps> extends React.Component<UnifiedPeoplePickerProps<TPersona>> {
  private _picker: UnifiedPicker<TPersona>;

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
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
          onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
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
      footerItemsProps={[]}
      shouldSelectFirstItem={this._suggestionIsNotEmpty}
      {...overriddenProps}
    />
  );

  /**
   * the default selected items list
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
      {...overriddenProps}
    />
  );

  private MainFloatingPicker = (overriddenProps: UnifiedPickerFloatingPickerProps<TPersona>) => {
    const Inner: ComposableMainFloatingPicker<TPersona> = this.props.onRenderMainFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.SuggestionControl} {...overriddenProps} />;
  };

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
