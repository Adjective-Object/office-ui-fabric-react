import { IStyle } from '../../../../Styling';
import { IStyleFunctionOrObject } from '../../../../Utilities';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { ISelectedItemProps } from 'office-ui-fabric-react/lib/SelectedItemsList';
import { CommonStylingProps, ICommonSubComponentStyles } from './CommonStylingProps.types';

/** PeoplePickerSelectedItem props interface. Refers to the PeoplePicker items that have been picked already. */
export type IPeoplePickerSelectedItemProps = ISelectedItemProps<IPersonaProps> &
  Partial<CommonStylingProps> & {
    styles?: IStyleFunctionOrObject<IPeoplePickerSelectedItemStyleProps, IPeoplePickerSelectedItemStyles>;
  };

/** Input to the PeoplePickerSelectedItem's styles function */
export type IPeoplePickerSelectedItemStyleProps = CommonStylingProps &
  Pick<IPeoplePickerSelectedItemProps, 'selected' | 'disabled'> & {
    /** Whether it's invalid. */
    invalid?: boolean;
  };

/** Represents the stylable areas of the PeoplePickerSelectedItem. */
export interface IPeoplePickerSelectedItemStyles {
  /** Root element of picked PeoplePicker item */
  root: IStyle;

  /** Refers to the element holding the content (Persona) of the PeoplePicker item already picked. */
  itemContent: IStyle;

  /** Refers to the remove action button on a picked PeoplePicker item. */
  removeButton: IStyle;

  /** SubComponent (Persona, PersonaCoin) styles. */
  subComponentStyles: ICommonSubComponentStyles;
}
