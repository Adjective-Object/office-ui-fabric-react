import * as React from 'react';
import { IPersonaProps } from '../../Persona';
import { UnifiedPicker } from '../UnifiedPicker';
import { IUnifiedPickerProps, UnifiedPickerSelectedItemsProps } from '../UnifiedPicker.types';
import { IEditingItemProps } from '../../SelectedItemsList/SelectedPeopleList/Items/EditingItem';
import { SuggestionsStore, FloatingPeoplePicker, BaseFloatingPickerSuggestionProps, IBaseFloatingPickerProps } from '../../FloatingPicker';
import { SelectedPeopleList, ISelectedPeopleProps } from '../../SelectedItemsList';
import { SuggestionsControl } from '../../FloatingPicker/Suggestions/SuggestionsControl';

export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;
export type WithMoreProps<TComponent extends React.ComponentType, TMoreProps> = React.ComponentType<PropsOf<TComponent> & TMoreProps>;

/**
 * Expand the exact floating picker props that are passed through to the UnifiedPicker
 * so that if FloatingPicker is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableMainFloatingPicker<T> = WithMoreProps<
  IUnifiedPickerProps<T>['onRenderFloatingPicker'],
  Pick<IBaseFloatingPickerProps<T>, 'onRenderSuggestionControl'>
>;

/**
 * Expand the exact floating picker props that are passed through to the UnifiedPicker
 * so that if FloatingPicker is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableEditingItemFloatingPicker<T> = WithMoreProps<
  NonNullable<IEditingItemProps<T>['onRenderFloatingPicker']>,
  Pick<IBaseFloatingPickerProps<T>, 'onRenderSuggestionControl'>
>;

export type UnifiedPeoplePickerProps<TPersona extends IPersonaProps> = {
  ////////////////////////////
  // Coordinated Components //
  ////////////////////////////
  onRenderFocusZone?: IUnifiedPickerProps<TPersona>['onRenderFocusZone'];
  onRenderMainFloatingPicker?: ComposableMainFloatingPicker<TPersona>;
  onRenderEditingItemFloatingPicker?: ComposableEditingItemFloatingPicker<TPersona>;
  onRenderSuggestionControl?: IBaseFloatingPickerProps<TPersona>['onRenderSuggestionControl'];

  ////////////////
  // Data Model //
  ////////////////

  onResolveSuggestions: IBaseFloatingPickerProps<TPersona>['onResolveSuggestions'];
  onValidateInput?: IBaseFloatingPickerProps<TPersona>['onValidateInput'];

  onRemoveSuggestion?: IBaseFloatingPickerProps<TPersona>['onRemoveSuggestion'];
  onZeroQuerySuggestion?: IBaseFloatingPickerProps<TPersona>['onZeroQuerySuggestion'];
  shouldShowForceResolveSuggestion?: IBaseFloatingPickerProps<TPersona>['showForceResolve'];
  onExpandSelectedItem?: ISelectedPeopleProps<TPersona>['onExpandGroup'];

  headerComponent?: IUnifiedPickerProps<TPersona>['headerComponent'];
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
        className={'ms-PeoplePicker'}
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
  private DefaultSuggestionControl = (overriddenProps: BaseFloatingPickerSuggestionProps<TPersona>) => (
    <SuggestionsControl
      showRemoveButtons={true}
      headerItemsProps={[]}
      footerItemsProps={[]}
      shouldSelectFirstItem={() => {
        return !this._shouldShowSuggestedContacts();
      }}
      {...overriddenProps}
    />
  );

  /**
   * The floating picker that is used by default for both the
   * floating picker suggestion dropdown and the suggestion well floating picker.
   */
  private DefaultFloatingPickerInner: ComposableMainFloatingPicker<TPersona> & ComposableEditingItemFloatingPicker<TPersona> = (
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

  private MainFloatingPicker = () => {
    const Inner = this.props.onRenderMainFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.DefaultSuggestionControl} />;
  };

  private EditingItemFloatingPicker = () => {
    const Inner = this.props.onRenderEditingItemFloatingPicker || this.DefaultFloatingPickerInner;
    return <Inner onRenderSuggestionControl={this.DefaultSuggestionControl} />;
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

  private _shouldShowSuggestedContacts = (): boolean => {
    return this._picker !== undefined && this._picker.inputElement !== null && this._picker.inputElement.value === '';
  };

  private _getTextFromItem(persona: TPersona): string {
    return persona.text as string;
  }
}
