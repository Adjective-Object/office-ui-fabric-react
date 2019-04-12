import * as React from 'react';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { UnifiedTagPickerProps } from './UnifiedTagPicker.types';
import { ComposingUnifiedPicker } from '../ComposingUnifiedPicker';
import { DefaultTagPickerSuggestion } from './defaults/DefaultTagPickerSuggestion';
import { DefaultTagItem } from './defaults/DefaultTagItem';

export const UnifiedTagPicker = <TTag extends ITag>(props: UnifiedTagPickerProps<TTag>) => {
  return (
    <ComposingUnifiedPicker
      onRenderSelectedItem={props.onRenderSelectedItem || DefaultTagItem}
      onRenderSuggestionItem={props.onRenderSuggestionItem || DefaultTagPickerSuggestion}
      {...props}
    />
  );
};
