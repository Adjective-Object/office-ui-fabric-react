import * as React from 'react';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { UnifiedTagPickerProps } from './UnifiedTagPicker.types';
import { DefaultTagPickerSuggestion } from './defaults/DefaultTagPickerSuggestion';
import { DefaultTagItem } from './defaults/DefaultTagItem';
import { useDefaultComposedUnifiedPickerView } from '../DefaultUnifiedPickerView/Composing/useDefaultComposedUnifiedPickerView';
import { UnifiedPicker } from '../UnifiedPicker';
import { IUnifiedPicker } from '../UnifiedPicker.types';
import { IDefaultUnifiedPickerView } from '../DefaultUnifiedPickerView/DefaultUnifiedPickerView.types';

type PickerRef<A, B> = IUnifiedPicker<A, B, IDefaultUnifiedPickerView<A, B>>;

export const UnifiedTagPicker = React.memo(
  <TSelectedTag extends ITag, TSuggestedTag extends ITag = TSelectedTag>(props: UnifiedTagPickerProps<TSelectedTag, TSuggestedTag>) => {
    type ViewRefType = IDefaultUnifiedPickerView<TSelectedTag, TSuggestedTag>;

    const PickerView = useDefaultComposedUnifiedPickerView<TSelectedTag, TSuggestedTag>({
      ...props,
      onRenderSuggestionItem: props.onRenderSuggestionItem || DefaultTagPickerSuggestion,
      onRenderSelectedItem: props.onRenderSelectedItem || DefaultTagItem
    });

    return <UnifiedPicker<TSelectedTag, TSuggestedTag, ViewRefType> {...props} view={PickerView} />;
  }
) as <TSelectedTag extends ITag, TSuggestedTag extends ITag = TSelectedTag>(
  props: UnifiedTagPickerProps<TSelectedTag, TSuggestedTag>
) => React.ReactElement;
// Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
// This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
export type UnifiedTagPicker<T1 extends ITag, T2 extends ITag = T1> = React.ComponentType<
  UnifiedTagPickerProps<T1, T2> & React.RefAttributes<PickerRef<T1, T2>>
>;
(UnifiedTagPicker as any).displayName = 'UnifiedTagPicker';
