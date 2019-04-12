import { ComposingUnifiedPickerProps } from '../ComposingUnifiedPicker.types';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';

type PartiallyOptional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Pick<Partial<T>, keyof T>;

/**
 * The PeoplePicker is just a picker with bound default rendering
 */
export type UnifiedPeoplePickerProps<TPersona extends IPersonaProps> = PartiallyOptional<
  ComposingUnifiedPickerProps<TPersona>,
  'onRenderSelectedItem' | 'onRenderSuggestionItem'
>;
