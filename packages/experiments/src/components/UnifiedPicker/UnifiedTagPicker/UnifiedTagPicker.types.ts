import { ComposingUnifiedPickerProps } from '../DefaultUnifiedPickerView/Composing/useDefaultComposedUnifiedPickerView.types';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { IUnifiedPickerProps } from '../UnifiedPicker.types';

type PartiallyOptional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Pick<Partial<T>, keyof T>;

/**
 * The TagPicker is just a picker with bound default rendering
 */
export type UnifiedTagPickerProps<TSelectedPersona extends ITag, TSuggestedPersona extends ITag = TSelectedPersona> = PartiallyOptional<
  ComposingUnifiedPickerProps<TSelectedPersona, TSuggestedPersona>,
  'onRenderSelectedItem' | 'onRenderSuggestionItem'
> &
  Pick<
    IUnifiedPickerProps<TSelectedPersona, TSuggestedPersona>,
    Exclude<keyof IUnifiedPickerProps<TSelectedPersona, TSuggestedPersona>, 'view'>
  >;
