import * as React from 'react';

import { classNamesFunction, styled, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Persona, PersonaSize, IPersonaStyleProps, IPersonaStyles, IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import {
  IPeoplePickerSuggestionItemProps,
  IPeoplePickerSuggestionItemStyleProps,
  IPeoplePickerSuggestionItemStyles
} from './PeoplePickerSuggestionItem.types';
import { getStyles } from './PeoplePickerSuggestionItem.styles';

const getClassNames = classNamesFunction<IPeoplePickerSuggestionItemStyleProps, IPeoplePickerSuggestionItemStyles>();

export const PeoplePickerSuggestionItem = styled(
  <TPersona extends IPersonaProps>(props: IPeoplePickerSuggestionItemProps<TPersona>) => {
    const { suggestionsProps, compact, styles, theme, className } = props;
    const personaProps: IPersonaProps = props.item;

    const classNames = getClassNames(styles, {
      theme: theme!,
      className: (suggestionsProps && suggestionsProps.suggestionsItemClassName) || className
    });

    const personaStyles =
      classNames.subComponentStyles && classNames.subComponentStyles.persona
        ? (classNames.subComponentStyles.persona as IStyleFunctionOrObject<IPersonaStyleProps, IPersonaStyles>)
        : undefined;

    return (
      <div className={classNames.root}>
        <Persona
          size={PersonaSize.size24}
          styles={personaStyles}
          className={classNames.personaWrapper}
          showSecondaryText={!compact}
          {...personaProps}
        />
      </div>
    );
  },
  getStyles,
  undefined,
  { scope: 'PeoplePickerSuggestionItem' }
) as <TPersona extends IPersonaProps>(props: IPeoplePickerSuggestionItemProps<TPersona>) => React.ReactElement;
export type PeoplePickerSuggestionItemInner<TPersona extends IPersonaProps> = (
  props: IPeoplePickerSuggestionItemProps<TPersona>
) => React.ReactElement;
