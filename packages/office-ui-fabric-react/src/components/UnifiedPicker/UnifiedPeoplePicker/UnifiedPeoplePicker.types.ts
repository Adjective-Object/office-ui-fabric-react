import * as React from 'react';
import { IPersonaProps } from '../../Persona/Persona.types';
import { IUnifiedPickerProps } from '../UnifiedPicker.types';
import { IEditingItemProps } from '../../SelectedItemsList/SelectedPeopleList/Items/EditingItem';
import { BaseFloatingPickerSuggestionProps, IBaseFloatingPickerProps, ISuggestionsControlProps } from '../../FloatingPicker/index';
import { ISelectedPeopleProps } from '../../SelectedItemsList/SelectedPeopleList/SelectedPeopleList';

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
  onRenderSelectedItem?: ISelectedPeopleProps<TPersona>['onRenderItem'];

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
