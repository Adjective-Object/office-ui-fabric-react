/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { SelectedItemsList } from '../SelectedItemsList';
import { SelectedPersona } from './Items/SelectedPersona';
import {
  ISelectedItemsListProps,
  ISelectedItemsList,
  BaseSelectedItem,
  IUncontrolledSelectedItemListProps,
  IControlledSelectedItemListProps
} from '../SelectedItemsList.types';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';

type PartiallyOptional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Pick<Partial<T>, keyof T>;
type PartiallyOptionalWithoutOnRenderItem<T extends { onRenderItem: any }> = PartiallyOptional<T, 'onRenderItem'>;

// Typescript does not distribute type aliases over generic unions.
// Give up and re-declare this type. Must be kept manually in sync with ISelectedItemListProps.
//
// TODO file a typescript issue for this?
export type ISelectedPeopleListProps<TPersona> =
  | PartiallyOptionalWithoutOnRenderItem<IUncontrolledSelectedItemListProps<TPersona>>
  | PartiallyOptionalWithoutOnRenderItem<IControlledSelectedItemListProps<TPersona>>;

export type ISelectedPeopleList<TPersona extends IPersonaProps & BaseSelectedItem = IPersonaProps> = ISelectedItemsList<TPersona>;
export type SelectedPeopleList<TPersona extends IPersonaProps & BaseSelectedItem = IPersonaProps> = SelectedItemsList<TPersona>;
export const SelectedPeopleList = React.forwardRef(
  <TPersona extends IPersonaProps & BaseSelectedItem = IPersonaProps>(
    props: ISelectedPeopleListProps<TPersona>,
    ref: React.Ref<ISelectedPeopleList<TPersona>>
  ) => {
    // Generics are not preserved in higher-order functions. Here we cast the component to the specific
    // instance of the generic type we need here.
    //
    // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
    // but oufr currently runs on typescript 3.3.3
    const SelectedPersonaList = SelectedItemsList as React.ForwardRefExoticComponent<
      React.RefAttributes<ISelectedItemsList<TPersona>> & React.PropsWithoutRef<ISelectedItemsListProps<TPersona>>
    >;
    return <SelectedPersonaList ref={ref} {...props} onRenderItem={props.onRenderItem || SelectedPersona} />;
  }
);
