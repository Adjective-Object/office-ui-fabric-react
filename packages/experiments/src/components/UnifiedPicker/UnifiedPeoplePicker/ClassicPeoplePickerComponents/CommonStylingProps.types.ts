import { ITheme } from 'office-ui-fabric-react/lib/Styling';
import { IPersonaStyleProps, IPersonaCoinStyleProps } from 'office-ui-fabric-react/lib/Persona';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';

/**
 * Common props for styling. Used accross all persona items.
 */
export type CommonStylingProps = {
  /** Theme provided by High-Order Component. */
  theme: ITheme;

  /** Additional CSS class(es) to apply to the PeoplePickerItem root element. */
  className?: string;
};

/** Styles interface of the SubComponents rendered within PeoplePickerSelectedItem. */
export interface ICommonSubComponentStyles {
  /** Refers to the Persona rendered within the PeoplePickerSelectedItem */
  persona: IStyleFunctionOrObject<IPersonaStyleProps, any>;

  /** Refers to the PersonaCoin in the Persona rendered within the PeoplePickerSelectedItem */
  personaCoin?: IStyleFunctionOrObject<IPersonaCoinStyleProps, any>;
}
