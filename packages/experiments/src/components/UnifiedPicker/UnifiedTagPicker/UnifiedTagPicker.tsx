import * as React from 'react';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { UnifiedTagPickerProps } from './UnifiedTagPicker.types';
import { DefaultTagPickerSuggestion } from './defaults/DefaultTagPickerSuggestion';
import { DefaultTagItem } from './defaults/DefaultTagItem';
import { useDefaultComposedUnifiedPickerView } from '../DefaultUnifiedPickerView/Composing/useDefaultComposedUnifiedPickerView';
import { UnifiedPicker } from '../UnifiedPicker';
import { IUnifiedPicker, IUnifiedPickerViewProps } from '../UnifiedPicker.types';
import { IDefaultUnifiedPickerView } from '../DefaultUnifiedPickerView/DefaultUnifiedPickerView.types';

type PickerRef<A, B> = IUnifiedPicker<A, B, IDefaultUnifiedPickerView<A, B>>;

export const UnifiedTagPicker = React.forwardRef(
  <TSelectedTag extends ITag, TSuggestedTag extends ITag = TSelectedTag>(
    props: UnifiedTagPickerProps<TSelectedTag, TSuggestedTag>,
    ref: React.Ref<PickerRef<TSelectedTag, TSuggestedTag>>
  ) => {
    type ViewRefType = IDefaultUnifiedPickerView<TSelectedTag, TSuggestedTag>;
    type ViewComponentType = React.ComponentType<IUnifiedPickerViewProps<TSelectedTag, TSuggestedTag> & React.RefAttributes<ViewRefType>>;

    const PickerView: ViewComponentType = useDefaultComposedUnifiedPickerView<TSelectedTag, TSuggestedTag>({
      ...props,
      onRenderSuggestionItem: props.onRenderSuggestionItem || DefaultTagPickerSuggestion,
      onRenderSelectedItem: props.onRenderSelectedItem || DefaultTagItem
    });

    return <UnifiedPicker<TSelectedTag, TSuggestedTag, ViewRefType> {...props} ref={ref} view={PickerView} />;
  }
) as <T1 extends ITag, T2 extends ITag = T1>(props: UnifiedTagPickerProps<T1, T2>, ref: React.Ref<PickerRef<T1, T2>>) => React.ReactElement;
export type UnifiedTagPicker<T1 extends ITag, T2 extends ITag = T1> = React.ComponentType<
  UnifiedTagPickerProps<T1, T2> & React.RefAttributes<PickerRef<T1, T2>>
>;
(UnifiedTagPicker as any).displayName = 'UnifiedTagPicker';
