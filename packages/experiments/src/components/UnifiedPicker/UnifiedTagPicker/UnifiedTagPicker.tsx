import * as React from 'react';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { UnifiedTagPickerProps } from './UnifiedTagPicker.types';
import { ComposingUnifiedPicker } from '../ComposingUnifiedPicker';
import { DefaultTagPickerSuggestion } from './defaults/DefaultTagPickerSuggestion';
import { DefaultTagItem } from './defaults/DefaultTagItem';

export const UnifiedTagPicker = React.forwardRef(
  <TTag extends ITag>(props: UnifiedTagPickerProps<TTag>, ref: React.RefObject<UnifiedTagPicker<TTag>>) => (
    <ComposingUnifiedPicker
      ref={ref}
      onRenderSelectedItem={props.onRenderSelectedItem || DefaultTagItem}
      onRenderSuggestionItem={props.onRenderSuggestionItem || DefaultTagPickerSuggestion}
      {...props}
    />
  )
);

export type UnifiedTagPicker<TTag extends ITag> = ComposingUnifiedPicker<TTag>;
