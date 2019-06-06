import { IStyle } from '../../../../Styling';
import { IStyleFunctionOrObject } from '../../../../Utilities';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { ISelectedItemProps } from '../../../SelectedItemsList';
import { CommonStylingProps, ICommonSubComponentStyles } from './CommonStylingProps.types';

/** PeoplePickerSelectedItem props interface. Refers to the PeoplePicker items that have been picked already. */
export type IClassicPeoplePickerSelectedItemProps<TPersona extends IPersonaProps> = ISelectedItemProps<TPersona> &
  Partial<CommonStylingProps> & {
    styles?: IStyleFunctionOrObject<IClassicPeoplePickerSelectedItemStyleProps<TPersona>, IClassicPeoplePickerSelectedItemStyles>;

    /**
     * Whether or not this persona is valid.
     *
     * The item list no longer has a concept of 'warning-level' valid items being inserted.
     *
     * If you want to use the old styles for these components, bind isValid by passing a
     * wrapping component to the onRenderItem to your SelectedItemsList, and derive the value
     * directly from your data model.
     */
    isValid?: boolean;
  };

/** Input to the PeoplePickerSelectedItem's styles function */
export type IClassicPeoplePickerSelectedItemStyleProps<TPersona = IPersonaProps> = CommonStylingProps &
  Pick<IClassicPeoplePickerSelectedItemProps<TPersona>, 'selected' | 'disabled'> & {
    /** Whether it's invalid. */
    invalid?: boolean;
  };

/** Represents the stylable areas of the PeoplePickerSelectedItem. */
export interface IClassicPeoplePickerSelectedItemStyles {
  /** Root element of picked PeoplePicker item */
  root: IStyle;

  /** Refers to the element holding the content (Persona) of the PeoplePicker item already picked. */
  itemContent: IStyle;

  /** Refers to the remove action button on a picked PeoplePicker item. */
  removeButton: IStyle;

  /** SubComponent (Persona, PersonaCoin) styles. */
  subComponentStyles: ICommonSubComponentStyles;
}
