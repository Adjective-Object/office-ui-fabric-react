import * as React from 'react';
import { SuggestionsControl } from 'office-ui-fabric-react/lib/FloatingPicker';
import { ComposableSuggestionControl } from '../../ComposingUnifiedPicker.types';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { ClassicPickerHeader } from './ClassicPickerHeader';
import { ClassicPickerFooter } from './ClassicPickerFooter';

type HeaderFooterInfo = {
  noResultsFooterText: string;
  suggestionsHeaderText: string;
  hasResults: () => boolean;
};

export const classicPickerSuggestions: <TPersona extends IPersonaProps>(
  headerProps: HeaderFooterInfo
) => ComposableSuggestionControl<TPersona> = ({ noResultsFooterText, suggestionsHeaderText, hasResults }: HeaderFooterInfo) => {
  const headerProps = [
    {
      renderItem: () => <ClassicPickerHeader text={suggestionsHeaderText} />,
      shouldShow: () => true
    }
  ];

  const footerProps = [
    {
      renderItem: () => <ClassicPickerFooter text={noResultsFooterText} />,
      shouldShow: () => !hasResults()
    }
  ];

  return overriddenProps => <SuggestionsControl headerItemsProps={headerProps} footerItemsProps={footerProps} {...overriddenProps} />;
};
