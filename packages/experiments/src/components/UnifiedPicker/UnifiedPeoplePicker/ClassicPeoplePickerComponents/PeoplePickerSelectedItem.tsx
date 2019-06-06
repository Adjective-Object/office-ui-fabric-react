import * as React from 'react';

import { getId, classNamesFunction, styled, IStyleFunctionOrObject } from '../../../../Utilities';
import {
  Persona,
  PersonaSize,
  IPersonaStyleProps,
  IPersonaStyles,
  IPersonaCoinStyleProps,
  IPersonaCoinStyles
} from 'office-ui-fabric-react/lib/Persona';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import {
  IClassicPeoplePickerSelectedItemProps,
  IClassicPeoplePickerSelectedItemStyleProps,
  IClassicPeoplePickerSelectedItemStyles
} from './PeoplePickerSelectedItem.types';
import { getStyles } from './PeoplePickerSelectedItem.styles';

const getClassNames = classNamesFunction<IClassicPeoplePickerSelectedItemStyleProps, IClassicPeoplePickerSelectedItemStyles>();

export const PeoplePickerSelectedItem = styled(
  <TPersona extends any>(props: IClassicPeoplePickerSelectedItemProps<TPersona>) => {
    const { item, onRemoveItem, index, selected, removeButtonAriaLabel, styles, theme, className, disabled } = props;

    const itemId = getId();

    const classNames = getClassNames(styles, {
      theme: theme!,
      className,
      selected,
      disabled,
      invalid: props.isValid === false
    });

    const removeItem = React.useCallback(() => onRemoveItem && onRemoveItem(), [onRemoveItem]);

    const personaStyles = classNames.subComponentStyles
      ? (classNames.subComponentStyles.persona as IStyleFunctionOrObject<IPersonaStyleProps, IPersonaStyles>)
      : undefined;

    const personaCoinStyles = classNames.subComponentStyles
      ? (classNames.subComponentStyles.personaCoin as IStyleFunctionOrObject<IPersonaCoinStyleProps, IPersonaCoinStyles>)
      : undefined;

    return (
      <div
        className={classNames.root}
        data-is-focusable={!disabled}
        data-is-sub-focuszone={true}
        data-selection-index={index}
        role={'listitem'}
        aria-labelledby={'selectedItemPersona-' + itemId}
      >
        <div className={classNames.itemContent} id={'selectedItemPersona-' + itemId}>
          <Persona size={PersonaSize.size24} styles={personaStyles} coinProps={{ styles: personaCoinStyles }} {...item} />
        </div>
        <IconButton
          onClick={removeItem}
          disabled={disabled}
          iconProps={{ iconName: 'Cancel', styles: { root: { fontSize: '12px' } } }}
          className={classNames.removeButton}
          ariaLabel={removeButtonAriaLabel}
        />
      </div>
    );
  },
  getStyles,
  undefined,
  { scope: 'PeoplePickerSelectedItemInner' }
) as <TPersona extends any>(props: IClassicPeoplePickerSelectedItemProps<TPersona>) => React.ReactElement;
export type PeoplePickerSelectedItemInner<TPersona extends any> = (
  props: IClassicPeoplePickerSelectedItemProps<TPersona>
) => React.ReactElement;
