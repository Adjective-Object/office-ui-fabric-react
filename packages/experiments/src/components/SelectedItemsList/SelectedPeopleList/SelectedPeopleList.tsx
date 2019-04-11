/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { SelectedItemsList } from '../SelectedItemsList';
import { SelectedPersona } from './items/SelectedPersona';
import { ISelectedItemsListProps, BaseSelectedItem } from '../SelectedItemsList.types';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';

export const SelectedPeopleList = function<TPersona extends IPersonaProps & BaseSelectedItem = IPersonaProps>(
  props: ISelectedItemsListProps<TPersona>
) {
  const TypedSelectedItemsList: React.ComponentType<ISelectedItemsListProps<TPersona>> = SelectedItemsList;
  return <TypedSelectedItemsList onRenderItem={SelectedPersona} {...props} />;
};
