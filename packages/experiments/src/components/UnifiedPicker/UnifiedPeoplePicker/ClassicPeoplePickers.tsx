import * as React from 'react';
import { PeoplePickerItem } from './ClassicPeoplePickerItems/PeoplePickerItem';
import { PeoplePickerSuggestionItem, IPeoplePickerSuggestionItemProps } from './ClassicPeoplePickerItems/PeoplePickerSuggestionItem';
import { UnifiedPeoplePickerProps } from './UnifiedPeoplePicker.types';
import { UnifiedPeoplePicker } from './UnifiedPeoplePicker';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';

/**
 * Special case of the UnifiedPeoplePicker binding custom rendering to match
 * the classic "Normal People Picker" styling
 */
const NormalPeoplePickerInner = <TPersona extends IPersonaProps = IPersonaProps>(
  props: UnifiedPeoplePickerProps<TPersona>,
  ref: React.Ref<UnifiedPeoplePicker<TPersona>>
) => (
  <UnifiedPeoplePicker ref={ref} onRenderSelectedItem={PeoplePickerItem} onRenderSuggestionItem={PeoplePickerSuggestionItem} {...props} />
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
    onRenderSelectedItem={PeoplePickerItem}
    onRenderSuggestionItem={CompactPeoplePickerSuggestionItem}
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
//     onRenderSelectedItem={PeoplePickerItem}
//     onRenderSuggestionItem={CompactPeoplePickerSuggestionItem}
//     {...props}
//   />
// );
