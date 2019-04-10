import * as React from 'react';
import { UnifiedPeoplePickerProps } from './UnifiedPeoplePicker.types';
import { UnifiedPeoplePicker } from './UnifiedPeoplePicker';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { ISuggestionItemProps } from 'office-ui-fabric-react/lib/Pickers';
import { PeoplePickerSelectedItem } from './ClassicPeoplePickerComponents/PeoplePickerSelectedItem';
import { PeoplePickerSuggestionItem } from './ClassicPeoplePickerComponents/PeoplePickerSuggestionItem';
import { IPeoplePickerSuggestionItemProps } from './ClassicPeoplePickerComponents/PeoplePickerSuggestionItem.types';
import { classicPickerStyleOverride } from './ClassicPeoplePickerComponents/ClassicPickerStyleOverride';
import { classicPickerSuggestions } from './ClassicPeoplePickerComponents/ClassicPickerSuggestions';

type ClassicPickerProps<TPersona extends IPersonaProps = IPersonaProps> = UnifiedPeoplePickerProps<TPersona> & {
  suggestionsHeaderText: string;
  noResultsFooterText: string;
};

/**
 * Binds a new component to the provided props.
 *
 * Required because of the SuggestionsControl header/footer API.
 * This seems like a good motivating example to tear that out and replace it.
 */
const wrapResolveSuggestionsAndGetBoundPickerSuggestions = <TPersona extends IPersonaProps>(
  onResolveSuggestions: UnifiedPeoplePickerProps<TPersona>['onResolveSuggestions'],
  suggestionsHeaderText: string,
  noResultsFooterText: string
): [UnifiedPeoplePickerProps<TPersona>['onResolveSuggestions'], UnifiedPeoplePickerProps<TPersona>['onRenderSuggestionControl']] => {
  // HACK: maintian state in this function scope as to whether or not the
  // "no results footer" should be shown
  let hasResults = true;
  const BoundClassicPickerSuggestions = classicPickerSuggestions<TPersona>({
    noResultsFooterText: noResultsFooterText,
    suggestionsHeaderText: suggestionsHeaderText,
    hasResults: () => hasResults
  });

  const wrappedResolveResults = (filter: string) => {
    const resolvedSuggestions: PromiseLike<TPersona[]> | TPersona[] | null = onResolveSuggestions(filter);
    if (resolvedSuggestions == null || Array.isArray(resolvedSuggestions)) {
      hasResults = !!(resolvedSuggestions && resolvedSuggestions.length);
      return resolvedSuggestions;
    }
    // install side-effect to track whther or not we want to show the
    // bound picker
    resolvedSuggestions.then(result => {
      hasResults = !!result.length;
    });
    return resolvedSuggestions;
  };

  return [wrappedResolveResults, BoundClassicPickerSuggestions];
};

/**
 * Special case of the UnifiedPeoplePicker binding custom rendering to match
 * the classic "Normal People Picker" styling
 */
const NormalPeoplePickerInner = <TPersona extends IPersonaProps = IPersonaProps>(
  props: ClassicPickerProps<TPersona>,
  ref: React.Ref<UnifiedPeoplePicker<TPersona>>
) => {
  const [wrappedResolveSuggestions, BoundClassicPickerSuggestionControl] = wrapResolveSuggestionsAndGetBoundPickerSuggestions<TPersona>(
    props.onResolveSuggestions,
    props.suggestionsHeaderText,
    props.noResultsFooterText
  );

  return (
    <UnifiedPeoplePicker
      ref={ref}
      styles={classicPickerStyleOverride}
      onRenderSelectedItem={PeoplePickerSelectedItem}
      onRenderSuggestionControl={BoundClassicPickerSuggestionControl}
      onRenderSuggestionItem={(props: TPersona, itemProps: ISuggestionItemProps<TPersona>) => <PeoplePickerSuggestionItem {...itemProps} />}
      {...props}
      onResolveSuggestions={wrappedResolveSuggestions}
    />
  );
};
export const NormalPeoplePicker = React.forwardRef(NormalPeoplePickerInner);

/**
 * Special case of the UnifiedPeoplePicker binding custom rendering ot match
 * the classic "Compact People Picker"'s Styling
 */
const CompactPeoplePickerInner = <TPersona extends IPersonaProps = IPersonaProps>(
  props: ClassicPickerProps<TPersona>,
  ref: React.Ref<UnifiedPeoplePicker<TPersona>>
) => {
  const [wrappedResolveSuggestions, BoundClassicPickerSuggestionControl] = wrapResolveSuggestionsAndGetBoundPickerSuggestions<TPersona>(
    props.onResolveSuggestions,
    props.suggestionsHeaderText,
    props.noResultsFooterText
  );

  return (
    <UnifiedPeoplePicker
      ref={ref}
      styles={classicPickerStyleOverride}
      onRenderSelectedItem={PeoplePickerSelectedItem}
      onRenderSuggestionControl={BoundClassicPickerSuggestionControl}
      onRenderSuggestionItem={(persona: TPersona, itemProps: ISuggestionItemProps<TPersona>) => (
        <CompactPeoplePickerSuggestionItem {...itemProps} />
      )}
      {...props}
      onResolveSuggestions={wrappedResolveSuggestions}
    />
  );
};

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
