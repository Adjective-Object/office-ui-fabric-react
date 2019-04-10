import { getGlobalClassNames, HighContrastSelector, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { IPeoplePickerSuggestionItemStyles, IPeoplePickerSuggestionItemStyleProps } from './PeoplePickerSuggestionItem.types';
import { SuggestionsItemGlobalClassNames as suggested } from 'office-ui-fabric-react/lib/Pickers';

const GlobalClassNames = {
  root: 'ms-PeoplePicker-personaContent',
  personaWrapper: 'ms-PeoplePicker-Persona'
};

export function getStyles(props: IPeoplePickerSuggestionItemStyleProps): IPeoplePickerSuggestionItemStyles {
  const { className, theme } = props;
  const classNames = getGlobalClassNames(GlobalClassNames, theme);

  const textSelectorsStyles: IStyle = {
    selectors: {
      [`.${suggested.isSuggested} &`]: {
        selectors: {
          [HighContrastSelector]: {
            color: 'HighlightText'
          }
        }
      },
      [`.${classNames.root}:hover &`]: {
        selectors: {
          [HighContrastSelector]: {
            color: 'HighlightText'
          }
        }
      }
    }
  };

  return {
    root: [
      classNames.root,
      {
        width: '100%',
        padding: '4px 12px'
      },
      className
    ],
    personaWrapper: [
      classNames.personaWrapper,
      {
        width: 180
      }
    ],
    subComponentStyles: {
      persona: {
        primaryText: textSelectorsStyles,
        secondaryText: textSelectorsStyles
      }
    }
  };
}
