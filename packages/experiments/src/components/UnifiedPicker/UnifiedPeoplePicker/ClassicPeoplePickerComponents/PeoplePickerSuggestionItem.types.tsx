import { IStyle } from 'office-ui-fabric-react/lib/Styling';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { CommonStylingProps, ICommonSubComponentStyles } from './CommonStylingProps.types';
import { ISuggestionModel, IBasePickerSuggestionsProps } from 'office-ui-fabric-react/lib/Pickers';

/** PeoplePickerItemSuggestion props interface. Refers to the PeoplePicker items that are suggested for picking. */
export type IPeoplePickerSuggestionItemProps<TPersona extends IPersonaProps> = ISuggestionModel<TPersona> &
  Partial<CommonStylingProps> & {
    styles?: IStyleFunctionOrObject<IPeoplePickerSuggestionItemStyleProps<TPersona>, IPeoplePickerSuggestionItemStyles>;
    compact?: boolean;
    /** General common props for all PeoplePicker items suggestions. */
    suggestionsProps?: IBasePickerSuggestionsProps;
  };

/** Props needed to construct PeoplePickerItemSuggestion styles. */
export type IPeoplePickerSuggestionItemStyleProps<TPersona extends IPersonaProps = IPersonaProps> = Required<
  Pick<IPeoplePickerSuggestionItemProps<TPersona>, 'theme'>
> &
  Pick<IPeoplePickerSuggestionItemProps<TPersona>, 'className'> & {};

/** Represents the stylable areas of the PeoplePickerItemSuggestion. */
export interface IPeoplePickerSuggestionItemStyles {
  /** Root container element of a suggested PeoplePicker item. */
  root: IStyle;

  /** Refers to the element wrapping the Persona of the suggested PeoplePicker item. */
  personaWrapper: IStyle;

  /** SubComponent (Persona, PersonaCoin) styles. */
  subComponentStyles: ICommonSubComponentStyles;
}
