import * as React from 'react';
import {
  IFloatingSuggestionsInnerSuggestionProps,
  IFloatingSuggestionsProps
} from '../../../FloatingSuggestions/FloatingSuggestions.types';
import { ISuggestionsCoreProps } from '../../../FloatingSuggestions/Suggestions/Suggestions.types';
import { ISelectedItemsListProps } from '../../../SelectedItemsList';
import { IDefaultUnifiedPickerViewProps, IDefaultUnifiedPickerViewPassthroughProps } from '../DefaultUnifiedPickerView.types';

export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;
export type WithMoreProps<TComponent extends React.ComponentType, TMoreProps> = React.ComponentType<PropsOf<TComponent> & TMoreProps>;

/**
 * Expand the exact floating picker props that are passed through from the UnifiedPicker
 * so that if FloatingPicker is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableMainFloatingSuggestions<TSelectedItem, TSuggestedItem = TSelectedItem> = WithMoreProps<
  IDefaultUnifiedPickerViewProps<TSelectedItem, TSuggestedItem>['onRenderFloatingSuggestions'],
  Pick<IFloatingSuggestionsProps<TSuggestedItem>, 'onRenderSuggestionControl'>
>;

/**
 * Expand the exact suggestion control props that are passed through from the FloatingPicker
 * so that if SuggestionControl is overridden, the consumer does not need to override the full
 * component subtree (e.g. the separately specified or default component)
 */
export type ComposableSuggestionControl<TSelectedItem, TSuggestedItem = TSelectedItem> = React.ComponentType<
  IFloatingSuggestionsInnerSuggestionProps<TSuggestedItem> & Pick<ISuggestionsCoreProps<TSuggestedItem>, 'onRenderSuggestion'>
>;

export type ComposingUnifiedPickerProps<TSelectedItem, TSuggestedItem = TSelectedItem> = {
  /**
   * Passed down to UnifiedPeoplePicker div. Required for fabric compliance.
   */
  className?: string;

  /////////////////////////////////////
  // Coordinated Internal Components //
  /////////////////////////////////////
  onRenderFocusZone?: IDefaultUnifiedPickerViewProps<TSelectedItem, TSuggestedItem>['onRenderFocusZone'];
  onRenderMainFloatingPicker?: ComposableMainFloatingSuggestions<TSelectedItem, TSuggestedItem>;
  onRenderSuggestionControl?: ComposableSuggestionControl<TSelectedItem, TSuggestedItem>;
  onRenderSuggestionItem: ISuggestionsCoreProps<TSuggestedItem>['onRenderSuggestion'];
  onRenderSelectedItem: ISelectedItemsListProps<TSelectedItem>['onRenderItem'];

  ///////////////////////////
  // Data Model (required) //
  ///////////////////////////
  onResolveSuggestions: IFloatingSuggestionsProps<TSuggestedItem>['onResolveSuggestions'];

  //////////////////////////////////////
  // Customizable Behavior (optional) //
  //////////////////////////////////////
  isQueryForceResolveable?: IFloatingSuggestionsProps<TSuggestedItem>['isQueryForceResolveable'];
  onZeroQuerySuggestion?: IFloatingSuggestionsProps<TSuggestedItem>['onZeroQuerySuggestion'];

  /////////////////////////////////////////////
  // Props for use as a controlled component //
  // TODO: write a wrapper component that    //
  // manages state for use as uncontrolled   //
  /////////////////////////////////////////////
  onRemoveSuggestion?: IFloatingSuggestionsProps<TSuggestedItem>['onRemoveSuggestion'];
} & IDefaultUnifiedPickerViewPassthroughProps;
