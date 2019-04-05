import * as React from 'react';
import { PeoplePickerSelectedItem } from './ClassicPeoplePickerComponents/PeoplePickerSelectedItem';
import { PeoplePickerSuggestionItem } from './ClassicPeoplePickerComponents/PeoplePickerSuggestionItem';
import { UnifiedPeoplePickerProps } from './UnifiedPeoplePicker.types';
import { UnifiedPeoplePicker } from './UnifiedPeoplePicker';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IPeoplePickerSuggestionItemProps } from './ClassicPeoplePickerComponents/PeoplePickerSuggestionItem.types';
import { ISuggestionItemProps } from 'office-ui-fabric-react/lib/Pickers';

/**
 * Special case of the UnifiedPeoplePicker binding custom rendering to match
 * the classic "Normal People Picker" styling
 */
const NormalPeoplePickerInner = <TPersona extends IPersonaProps = IPersonaProps>(
  props: UnifiedPeoplePickerProps<TPersona>,
  ref: React.Ref<UnifiedPeoplePicker<TPersona>>
) => (
  <UnifiedPeoplePicker
    ref={ref}
    onRenderSelectedItem={PeoplePickerSelectedItem}
    onRenderSuggestionItem={(props: TPersona, itemProps: ISuggestionItemProps<TPersona>) => <PeoplePickerSuggestionItem {...itemProps} />}
    {...props}
  />
);
export const NormalPeoplePicker = React.forwardRef(NormalPeoplePickerInner);

/**
 * Special case of the UnifiedPeoplePicker binding custom rendering ot match
 * the classic "Compact People Picker"'s Styling
 */
const CompactPeoplePickerInner = <TPersona extends IPersonaProps = IPersonaProps>(
  props: UnifiedPeoplePickerProps<TPersona>,
  ref: React.Ref<UnifiedPeoplePicker<TPersona>>
) => (
  <UnifiedPeoplePicker
    ref={ref}
    onRenderSelectedItem={PeoplePickerSelectedItem}
    onRenderSuggestionItem={(persona: TPersona, itemProps: ISuggestionItemProps<TPersona>) => (
      <CompactPeoplePickerSuggestionItem {...itemProps} />
    )}
    {...props}
  />
);

const CompactPeoplePickerSuggestionItem = (props: IPeoplePickerSuggestionItemProps) => (
  <PeoplePickerSuggestionItem {...props} compact={true} />
);

export const CompactPeoplePicker = React.forwardRef(CompactPeoplePickerInner);

// /**
//  * Special case of the UnifiedPeoplePicker binding custom rendering ot match
//  * the classic "Compact People Picker"'s Styling
//  */
// const ListPeoplePicker = <TPersona extends IPersonaProps = IPersonaProps>(
//   props: UnifiedPeoplePickerProps<TPersona>,
//   ref: React.Ref<UnifiedPeoplePicker<TPersona>>
// ) => (
//   <UnifiedPeoplePicker
//     ref={ref}
//     onRenderSelectedItem={PeoplePickerSelectedItem}
//     onRenderSuggestionItem={CompactPeoplePickerSuggestionItem}
//     {...props}
//   />
// );
