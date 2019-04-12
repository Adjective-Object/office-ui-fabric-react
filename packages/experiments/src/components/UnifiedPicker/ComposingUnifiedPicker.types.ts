import * as React from 'react';
import { IFloatingSuggestionsInnerSuggestionProps, IFloatingSuggestionsProps } from '../FloatingSuggestions/FloatingSuggestions.types';
import { ISuggestionsControlProps } from '../FloatingSuggestions/Suggestions/Suggestions.types';
import { ISelectedItemsListProps } from '../SelectedItemsList';
import { IUnifiedPickerProps, IUnifiedPickerComponentPassthroughProps } from './UnifiedPicker.types';

export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;
export type WithMoreProps<TComponent extends React.ComponentType, TMoreProps> = React.ComponentType<PropsOf<TComponent> & TMoreProps>;

/**
 * Expand the exact floating picker props that are passed through from the UnifiedPicker
 * so that if FloatingPicker is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableMainFloatingPicker<T> = WithMoreProps<
  IUnifiedPickerProps<T>['onRenderFloatingPicker'],
  Pick<IFloatingSuggestionsProps<T>, 'onRenderSuggestionControl'>
>;

/**
 * Expand the exact suggestion control props that are passed through from the FloatingPicker
 * so that if SuggestionControl is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableSuggestionControl<T> = React.ComponentType<
  IFloatingSuggestionsInnerSuggestionProps<T> & Pick<ISuggestionsControlProps<T>, 'onRenderSuggestion'>
>;

export type ComposingUnifiedPickerProps<T> = {
  /**
   * Passed down to UnifiedPeoplePicker div. Required for fabric compliance.
   */
  className?: string;

  /////////////////////////////////////
  // Coordinated Internal Components //
  /////////////////////////////////////
  onRenderFocusZone?: IUnifiedPickerProps<T>['onRenderFocusZone'];
  onRenderMainFloatingPicker?: ComposableMainFloatingPicker<T>;
  onRenderSuggestionControl?: ComposableSuggestionControl<T>;
  onRenderSuggestionItem: ISuggestionsControlProps<T>['onRenderSuggestion'];
  onRenderSelectedItem: ISelectedItemsListProps<T>['onRenderItem'];

  ///////////////////////////
  // Data Model (required) //
  ///////////////////////////
  onResolveSuggestions: IFloatingSuggestionsProps<T>['onResolveSuggestions'];

  //////////////////////////////////////
  // Customizable Behavior (optional) //
  //////////////////////////////////////
  isQueryForceResolveable?: IFloatingSuggestionsProps<T>['isQueryForceResolveable'];
  onZeroQuerySuggestion?: IFloatingSuggestionsProps<T>['onZeroQuerySuggestion'];

  /////////////////////////////////////////////
  // Props for use as a controlled component //
  // TODO: write a wrapper component that    //
  // manages state for use as uncontrolled   //
  /////////////////////////////////////////////
  onRemoveSuggestion?: IFloatingSuggestionsProps<T>['onRemoveSuggestion'];
} & IUnifiedPickerComponentPassthroughProps;
