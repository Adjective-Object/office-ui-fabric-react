import * as React from 'react';
import { TriggerProps } from './ItemTrigger.types';
import { ISelectedItemProps } from '../SelectedItemsList.types';

export const TriggerOnContextMenu = function<T>(ItemComponent: React.ComponentType<ISelectedItemProps<T>>) {
  return (props: TriggerProps<T>) => {
    const trigger = React.useCallback(
      e => {
        e.preventDefault();
        e.stopPropagation();
        props.onTrigger && props.onTrigger();
      },
      [props.onTrigger]
    );
    return <ItemComponent {...props} onContextMenu={trigger} />;
  };
};
