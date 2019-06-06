import * as React from 'react';
import {
  FloatingSuggestions,
  SuggestionsStore,
  IFloatingSuggestionsInnerSuggestionProps,
  IFloatingSuggestions
} from '../../../FloatingSuggestions';
import { SelectedItemsList, ISelectedItemsList } from '../../../SelectedItemsList';
import { SuggestionsControl } from '../../../FloatingSuggestions';
import {
  ComposingUnifiedPickerProps,
  ComposableSuggestionControl,
  ComposableMainFloatingSuggestions,
  PropsOf
} from './useDefaultComposedUnifiedPickerView.types';
import { IUnifiedPicker, IUnifiedPickerViewProps } from '../../UnifiedPicker.types';
import { DefaultUnifiedPickerView } from '../DefaultUnifiedPickerView';
import {
  IDefaultUnifiedPickerView,
  DefaultUnifiedPickerViewFloatingPickerProps,
  DefaultUnifiedPickerViewSelectedItemsProps
} from '../DefaultUnifiedPickerView.types';
import { FocusZone } from '../../../../../../office-ui-fabric-react/lib';

/**
 * Renders a UnifiedPickerView with the default picker view, while handling composition of the subcomponents consumed
 * by the DefaultUnifiedPickerView.
 */
export const useDefaultComposedUnifiedPickerView = <TSelectedItem, TSuggestedItem = TSelectedItem>(
  props: ComposingUnifiedPickerProps<TSelectedItem, TSuggestedItem>
): React.ComponentType<IUnifiedPickerViewProps<TSelectedItem, TSuggestedItem>> => {
  const {
    // render methods
    onRenderFocusZone,
    onRenderSuggestionControl,
    onRenderSuggestionItem,
    onRenderSelectedItem,
    onRenderMainFloatingPicker,
    // data marshalling callbacks
    onRemoveSuggestion,
    onResolveSuggestions,
    onZeroQuerySuggestion,
    isQueryForceResolveable
  } = props;

  const unifiedPickerRef = React.useRef<
    IUnifiedPicker<TSelectedItem, TSuggestedItem, IDefaultUnifiedPickerView<TSelectedItem, TSuggestedItem>>
  >(null);

  const isInputEmpty = React.useCallback(() => !unifiedPickerRef.current || unifiedPickerRef.current.queryString !== '', [
    unifiedPickerRef
  ]);

  /**
   * The default suggestions control that is rendered if no SuggestionsControl is provided by the parent
   */
  const DefaultSuggestionControlInner: ComposableSuggestionControl<TSelectedItem, TSuggestedItem> = React.useMemo(
    () => (overriddenProps: PropsOf<ComposableSuggestionControl<TSelectedItem, TSuggestedItem>>, ref) => (
      <SuggestionsControl
        showRemoveButtons={onRemoveSuggestion !== undefined}
        headerItemsProps={[]}
        // footerItemsProps={this._defaultFooterItem_.items}
        shouldSelectFirstItem={isInputEmpty}
        {...overriddenProps}
        ref={ref}
      />
    ),
    [unifiedPickerRef, onRemoveSuggestion]
  );
  (DefaultSuggestionControlInner as any).displayName = '$Composed_PickerView$::DefaultSuggestionControlInner';

  /**
   * Renders the suggestion control that is passed to both the
   * main picker and the editing item picker.
   *
   * Uses the default suggestion control if none is provided.
   */
  const ComposedSuggestionControl = React.useMemo(
    () =>
      React.forwardRef((overriddenProps: IFloatingSuggestionsInnerSuggestionProps<TSuggestedItem>) => {
        const Inner: ComposableSuggestionControl<TSelectedItem, TSuggestedItem> =
          onRenderSuggestionControl || DefaultSuggestionControlInner;
        return <Inner onRenderSuggestion={onRenderSuggestionItem} {...overriddenProps} ref={ref} />;
      }),
    [onRenderSuggestionControl, DefaultSuggestionControlInner]
  );
  (ComposedSuggestionControl as any).displayName = '$Composed_PickerView$::ComposedSuggestionControl';

  /**
   * The floating picker that is used by default for both the
   * floating picker suggestion dropdown and the suggestion well floating picker.
   */
  const DefaultFloatingSuggestions: ComposableMainFloatingSuggestions<TSelectedItem, TSuggestedItem> = React.useMemo(
    () =>
      React.forwardRef(
        (
          overriddenProps: PropsOf<ComposableMainFloatingSuggestions<TSelectedItem, TSuggestedItem>>,
          ref: React.Ref<IFloatingSuggestions<TSuggestedItem>>
        ) => (
          <FloatingSuggestions<TSuggestedItem>
            suggestionsStore={new SuggestionsStore<TSuggestedItem>()}
            onResolveSuggestions={onResolveSuggestions}
            onRemoveSuggestion={onRemoveSuggestion}
            onZeroQuerySuggestion={onZeroQuerySuggestion}
            isQueryForceResolveable={isQueryForceResolveable}
            onRenderSuggestionsItem={onRenderSuggestionItem}
            {...overriddenProps}
            // This cast shouldn't be needed because refs are "write" parameters, and
            // so they are contravariant with the type argument.
            //
            // However, since it's being used as a function argument, it's
            // assumed by typescript to be covarinat in this context.
            ref={ref as React.Ref<FloatingSuggestions<TSuggestedItem>>}
          />
        )
      ),
    [onRemoveSuggestion, onResolveSuggestions, onZeroQuerySuggestion, isQueryForceResolveable]
  );
  (DefaultFloatingSuggestions as any).displayName = '$Composed_PickerView$::DefaultFloatingSuggestions';

  /**FloatingSuggestions
   * Renders the floating picker for the main input.
   * Uses the default picker if none is provided.
   */
  const ComposedFloatingSuggestions = React.useMemo(
    () =>
      React.forwardRef(
        (
          overriddenProps: DefaultUnifiedPickerViewFloatingPickerProps<TSuggestedItem>,
          ref: React.Ref<IFloatingSuggestions<TSuggestedItem>>
        ) => {
          const Inner: ComposableMainFloatingSuggestions<TSelectedItem, TSuggestedItem> =
            onRenderMainFloatingPicker || DefaultFloatingSuggestions;
          return <Inner onRenderSuggestionControl={ComposedSuggestionControl} {...overriddenProps} ref={ref} />;
        }
      ),
    [onRenderMainFloatingPicker, DefaultFloatingSuggestions]
  );
  (ComposedFloatingSuggestions as any).displayName = '$Composed_PickerView$::ComposedFloatingSuggestions';

  /**
   * the default selected items list
   */
  const ComposedSelectedItemsList = React.useMemo(
    () =>
      React.forwardRef(
        (overriddenProps: DefaultUnifiedPickerViewSelectedItemsProps<TSelectedItem>, ref: React.Ref<ISelectedItemsList<TSelectedItem>>) => (
          <SelectedItemsList<TSelectedItem> onRenderItem={onRenderSelectedItem} {...overriddenProps} ref={ref} />
        )
      ),
    [onRenderSelectedItem]
  );
  (ComposedSelectedItemsList as any).displayName = '$Composed_PickerView$::ComposedSelectedItemsList';

  const PickerView = React.useMemo(
    () =>
      React.forwardRef(
        (
          pickerProps: IUnifiedPickerViewProps<TSelectedItem, TSuggestedItem>,
          ref: React.Ref<IDefaultUnifiedPickerView<TSelectedItem, TSuggestedItem>>
        ) => (
          <DefaultUnifiedPickerView
            ref={ref}
            // Styling props pasthrough
            className={props.className}
            styles={props.styles}
            disabled={props.disabled}
            //actual composed props
            onRenderFocusZone={onRenderFocusZone || FocusZone}
            onRenderSelectedItems={ComposedSelectedItemsList}
            onRenderFloatingSuggestions={ComposedFloatingSuggestions}
            // control props passthrough (from UnifiedPicker)
            {...pickerProps}
          />
        )
      ),
    [onRenderFocusZone, ComposedSelectedItemsList, ComposedSuggestionControl]
  );

  (PickerView as any).displayName = '$Composed_PickerView$';
  return PickerView;
};
