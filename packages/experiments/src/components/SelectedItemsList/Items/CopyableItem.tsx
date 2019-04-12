import * as React from 'react';
import { ISelectedItemProps } from '../SelectedItemsList.types';

type CopyableItemWrappedComponent<T> = React.ComponentType<ISelectedItemProps<T>>;

/**
 * Parameters to the EditingItem higher-order component
 */
export type CopyableItemProps<T> = {
  itemComponent: CopyableItemWrappedComponent<T>;
  getCopyItemText: (items: T[]) => string;
};

export const CopyableItem = function<T>(copyableItemProps: CopyableItemProps<T>): CopyableItemWrappedComponent<T> {
  return React.memo((selectedItemProps: ISelectedItemProps<T>) => {
    const onCopy = React.useCallback(
      item => {
        const copyText = copyableItemProps.getCopyItemText([item]);
        const copyInput = document.createElement('input') as HTMLInputElement;
        document.body.appendChild(copyInput);

        try {
          // Try to copy the text directly to the clipboard
          copyInput.value = copyText;
          copyInput.select();
          if (!document.execCommand('copy')) {
            // The command failed. Fallback to the method below.
            throw new Error();
          }
        } catch (err) {
          // no op
        } finally {
          document.body.removeChild(copyInput);
        }
      },
      [copyableItemProps.getCopyItemText]
    );

    const ItemComponent = copyableItemProps.itemComponent;
    return <ItemComponent {...selectedItemProps} onCopy={onCopy} />;
  });
};
