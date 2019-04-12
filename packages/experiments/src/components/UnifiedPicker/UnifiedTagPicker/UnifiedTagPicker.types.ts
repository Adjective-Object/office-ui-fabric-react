import { ComposingUnifiedPickerProps } from '../ComposingUnifiedPicker.types';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';

type PartiallyOptional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Pick<Partial<T>, keyof T>;

/**
 * The TagPicker is just a picker with bound default rendering
 */
export type UnifiedTagPickerProps<TTag extends ITag> = PartiallyOptional<
  ComposingUnifiedPickerProps<TTag>,
  'onRenderSelectedItem' | 'onRenderSuggestionItem'
>;
