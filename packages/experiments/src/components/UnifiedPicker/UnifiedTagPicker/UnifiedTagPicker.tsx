import * as React from 'react';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { UnifiedTagPickerProps } from './UnifiedTagPicker.types';
import { ComposingUnifiedPicker } from '../ComposingUnifiedPicker';
import { DefaultTagPickerSuggestion } from './defaults/DefaultTagPickerSuggestion';
import { DefaultTagItem } from './defaults/DefaultTagItem';

const UnifiedTagPickerInner = <TTag extends ITag>(props: UnifiedTagPickerProps<TTag>, ref: React.RefObject<UnifiedTagPicker<TTag>>) => (
  <ComposingUnifiedPicker<TTag>
    ref={ref}
    onRenderSelectedItem={props.onRenderSelectedItem || DefaultTagItem}
    onRenderSuggestionItem={props.onRenderSuggestionItem || DefaultTagPickerSuggestion}
    {...props}
  />
);

// Separate signature export only works when the value being overridden is a function value,
// and it doens't pick up on React.forwardRef
//
// Here we lie about the type of the ref forwarding component to allow exporting the higher-order
// functional component as a generic.
export const UnifiedTagPicker = React.forwardRef(UnifiedTagPickerInner) as typeof UnifiedTagPickerInner;
export type UnifiedTagPicker<TTag extends ITag> = ComposingUnifiedPicker<TTag>;
