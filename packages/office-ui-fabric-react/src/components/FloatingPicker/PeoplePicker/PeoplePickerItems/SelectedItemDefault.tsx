/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { css, getId } from '../../../../Utilities';
import { Persona, PersonaSize, PersonaPresence } from '../../../../Persona';
import { IconButton } from '../../../../Button';
import * as stylesImport from './PickerItemsDefault.scss';
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona';
import { ISuggestionItemProps } from 'office-ui-fabric-react/lib/components/pickers';
// tslint:disable-next-line:no-any
const styles: any = stylesImport;

export const SelectedItemDefault: (props: ISuggestionItemProps<IPersonaProps>) => JSX.Element = (
  peoplePickerItemProps: ISuggestionItemProps<IPersonaProps>
) => {
  const { item, onRemoveItem, index, selected, removeButtonAriaLabel } = peoplePickerItemProps;

  const itemId = getId();
  const onClickIconButton = (removeItem: (() => void) | undefined): (() => void) => {
    return (): void => {
      if (removeItem) {
        removeItem();
      }
    };
  };

  return (
    <div
      className={css(
        'ms-PickerPersona-container',
        styles.personaContainer,
        { ['is-selected ' + styles.personaContainerIsSelected]: selected },
        { ['is-invalid ' + styles.validationError]: !item.isValid }
      )}
      data-is-focusable={true}
      data-is-sub-focuszone={true}
      data-selection-index={index}
      role={'listitem'}
      aria-labelledby={'selectedItemPersona-' + itemId}
    >
      <div className={css('ms-PickerItem-content', styles.itemContent)} id={'selectedItemPersona-' + itemId}>
        <Persona {...item} presence={item.presence !== undefined ? item.presence : PersonaPresence.none} size={PersonaSize.size28} />
      </div>
      <IconButton
        onClick={onClickIconButton(onRemoveItem)}
        iconProps={{ iconName: 'Cancel', style: { fontSize: '12px' } }}
        className={css('ms-PickerItem-removeButton', styles.removeButton)}
        ariaLabel={removeButtonAriaLabel}
      />
    </div>
  );
};
