import * as React from 'react';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { UnifiedPeoplePickerProps } from './UnifiedPeoplePicker.types';
import { PeoplePickerItemDefault } from '../../FloatingSuggestions/FloatingPeopleSuggestions/defaults/PeoplePickerItemDefault';
import { ComposingUnifiedPicker } from '../ComposingUnifiedPicker';
import { SelectedPersona } from '../../SelectedItemsList';

export const UnifiedPeoplePicker = <TPersona extends IPersonaProps>(props: UnifiedPeoplePickerProps<TPersona>) => {
  return (
    <ComposingUnifiedPicker
      onRenderSelectedItem={props.onRenderSelectedItem || SelectedPersona}
      onRenderSuggestionItem={props.onRenderSuggestionItem || PeoplePickerItemDefault}
      {...props}
    />
  );
};
