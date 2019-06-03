import * as React from 'react';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { UnifiedPeoplePickerProps } from './UnifiedPeoplePicker.types';
import { DefaultPeopleSuggestionsItem } from '../../FloatingSuggestions/FloatingPeopleSuggestions/defaults/DefaultPeopleSuggestionsItem';
import { ComposingUnifiedPicker } from '../ComposingUnifiedPicker';
import { SelectedPersona } from '../../SelectedItemsList';

const UnifiedPeoplePickerInner = <TPersona extends IPersonaProps>(
  props: UnifiedPeoplePickerProps<TPersona>,
  ref: React.RefObject<UnifiedPeoplePicker<TPersona>>
) => {
  return (
    <ComposingUnifiedPicker<TPersona>
      ref={ref}
      onRenderSelectedItem={props.onRenderSelectedItem || SelectedPersona}
      onRenderSuggestionItem={props.onRenderSuggestionItem || DefaultPeopleSuggestionsItem}
      {...props}
    />
  );
};

// Separate signature export only works when the value being overridden is a function value,
// and it doens't pick up on React.forwardRef
//
// Here we lie about the type of the ref forwarding component to allow exporting the higher-order
// functional component as a generic.
export const UnifiedPeoplePicker = React.forwardRef(UnifiedPeoplePickerInner) as typeof UnifiedPeoplePickerInner;
export type UnifiedPeoplePicker<TPersona extends IPersonaProps> = ComposingUnifiedPicker<TPersona>;
