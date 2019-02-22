/* tslint:disable */
import { IPickerItemProps } from '../../../Pickers';
/* tslint:enable */

import { IExtendedPersonaProps } from '../../../SelectedItemsList';
import { IPersonaProps } from '../../../Persona';
import './ExtendedPeoplePicker.scss';
import { BaseExtendedPicker } from '../BaseExtendedPicker';
import { IBaseExtendedPickerProps } from '../BaseExtendedPicker.types';

export interface IPeoplePickerItemProps extends IPickerItemProps<IExtendedPersonaProps> {}

export class BaseExtendedPeoplePicker<TPersona extends IPersonaProps = IPersonaProps> extends BaseExtendedPicker<
  IPersonaProps,
  IBaseExtendedPickerProps<TPersona>
> {}

export class ExtendedPeoplePicker extends BaseExtendedPeoplePicker {}
