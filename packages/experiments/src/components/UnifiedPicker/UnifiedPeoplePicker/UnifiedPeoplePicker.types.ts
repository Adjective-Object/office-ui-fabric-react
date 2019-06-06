import { ComposingUnifiedPickerProps } from '../DefaultUnifiedPickerView/Composing/useDefaultComposedUnifiedPickerView.types';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IUnifiedPickerProps } from '../UnifiedPicker.types';

type PartiallyOptional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Pick<Partial<T>, keyof T>;

/**
 * The PeoplePicker is just a picker with bound default rendering
 */
export type UnifiedPeoplePickerProps<
  TSelectedPersona extends IPersonaProps,
  TSuggestedPersona extends IPersonaProps = TSelectedPersona
> = PartiallyOptional<ComposingUnifiedPickerProps<TSelectedPersona, TSuggestedPersona>, 'onRenderSelectedItem' | 'onRenderSuggestionItem'> &
  Pick<
    IUnifiedPickerProps<TSelectedPersona, TSuggestedPersona>,
    Exclude<keyof IUnifiedPickerProps<TSelectedPersona, TSuggestedPersona>, 'view'>
  >;
