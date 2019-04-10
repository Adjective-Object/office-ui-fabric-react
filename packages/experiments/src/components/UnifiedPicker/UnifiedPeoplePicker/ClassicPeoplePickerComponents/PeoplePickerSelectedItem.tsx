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
import { ValidationState } from 'office-ui-fabric-react/lib/Pickers';
import {
  IPeoplePickerSelectedItemProps,
  IPeoplePickerSelectedItemStyleProps,
  IPeoplePickerSelectedItemStyles
} from './PeoplePickerSelectedItem.types';
import { getStyles } from './PeoplePickerSelectedItem.styles';

const getClassNames = classNamesFunction<IPeoplePickerSelectedItemStyleProps, IPeoplePickerSelectedItemStyles>();

export const PeoplePickerSelectedItemInner = (props: IPeoplePickerSelectedItemProps) => {
  const { item, onRemoveItem, index, selected, removeButtonAriaLabel, styles, theme, className, disabled } = props;

  const itemId = getId();

  const classNames = getClassNames(styles, {
    theme: theme!,
    className,
    selected,
    disabled,
    // TODO port validation state to selected item props
    invalid: props.validationState === ValidationState.warning
  });

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
        onClick={onRemoveItem}
        disabled={disabled}
        iconProps={{ iconName: 'Cancel', styles: { root: { fontSize: '12px' } } }}
        className={classNames.removeButton}
        ariaLabel={removeButtonAriaLabel}
      />
    </div>
  );
};

export const PeoplePickerSelectedItem = styled<
  IPeoplePickerSelectedItemProps,
  IPeoplePickerSelectedItemStyleProps,
  IPeoplePickerSelectedItemStyles
>(PeoplePickerSelectedItemInner, getStyles, undefined, { scope: 'PeoplePickerItem' });
