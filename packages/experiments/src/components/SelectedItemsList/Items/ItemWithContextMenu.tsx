import * as React from 'react';
import { ContextualMenu, DirectionalHint, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { ISelectedItemProps } from '../SelectedItemsList.types';

type ItemWithContextMenuWrappedComponent<T> = React.ComponentType<ISelectedItemProps<T>>;

/**
 * Parameters to the EditingItem higher-order component
 */
export type ItemWithContextMenuProps<T> = {
  itemComponent: ItemWithContextMenuWrappedComponent<T>;
  menuItems: IContextualMenuItem[];
};

export const ItemWithContextMenu = function<T>(
  itemWithContextMenuProps: ItemWithContextMenuProps<T>
): ItemWithContextMenuWrappedComponent<T> {
  return React.memo((selectedItemProps: ISelectedItemProps<T>) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);
    const openContextMenu = React.useCallback(() => setIsContextMenuOpen(true), [setIsContextMenuOpen]);
    const closeContextMenu = React.useCallback(() => setIsContextMenuOpen(false), [setIsContextMenuOpen]);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const ItemComponent = itemWithContextMenuProps.itemComponent;

    return (
      <div ref={containerRef} onContextMenu={openContextMenu}>
        <ItemComponent {...selectedItemProps} />
        {isContextMenuOpen ? (
          <ContextualMenu
            items={itemWithContextMenuProps.menuItems}
            shouldFocusOnMount={true}
            target={containerRef.current}
            onDismiss={closeContextMenu}
            directionalHint={DirectionalHint.bottomLeftEdge}
          />
        ) : null}
      </div>
    );
  });
};
