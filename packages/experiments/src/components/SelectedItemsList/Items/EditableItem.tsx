import * as React from 'react';
import { ISelectedItemProps } from '../SelectedItemsList.types';
import { EditingItem, EditingItemFloatingPickerProps } from './EditingItem';

type EditableItemWrappedComponent<T> = React.ComponentType<ISelectedItemProps<T>>;

/**
 * Parameters to the EditingItem higher-order component
 */
export type EditableItemProps<T> = {
  itemComponent: EditableItemWrappedComponent<T>;
  onRenderFloatingPicker: React.ComponentType<EditingItemFloatingPickerProps<T>>;
  getEditingItemText: (item: T) => string;
};

export const EditableItem = function<T>(editableItemProps: EditableItemProps<T>): EditableItemWrappedComponent<T> {
  return React.memo((selectedItemProps: ISelectedItemProps<T>) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const setEditingTrue = React.useCallback(() => setIsEditing(true), [setIsEditing]);
    const onItemEdited = React.useCallback(
      item => selectedItemProps.onItemChange && selectedItemProps.onItemChange(item, selectedItemProps.index),
      [selectedItemProps.onItemChange]
    );

    const ItemComponent = editableItemProps.itemComponent;

    return isEditing ? (
      <EditingItem
        item={selectedItemProps.item}
        onRenderFloatingPicker={editableItemProps.onRenderFloatingPicker}
        onEditingComplete={onItemEdited}
        getEditingItemText={editableItemProps.getEditingItemText}
      />
    ) : (
      <ItemComponent {...selectedItemProps} onContextMenu={setEditingTrue} />
    );
  });
};
