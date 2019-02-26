/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { BaseSelectedItemsList } from '../BaseSelectedItemsList';
import { IBaseSelectedItemsListProps, ISelectedItemProps } from '../BaseSelectedItemsList.types';
import { IPersonaProps } from '../../../Persona';
import { ExtendedSelectedItem } from './Items/ExtendedSelectedItem';
import { SelectedItemWithContextMenu } from './Items/SelectedItemWithContextMenu';
import { IRenderFunction } from '../../../Utilities';
import { IContextualMenuItem } from '../../../ContextualMenu';
import { IBaseFloatingPickerProps } from '../../../FloatingPicker';
import { EditingItem } from './Items/EditingItem';

export interface IExtendedPersonaProps extends IPersonaProps {
  key?: any;
  isValid?: boolean;
  blockRecipientRemoval?: boolean;
  shouldBlockSelection?: boolean;
  canExpand?: boolean;
  isEditing?: boolean;
}

export interface ISelectedPeopleItemProps<TPersona extends IExtendedPersonaProps = IExtendedPersonaProps>
  extends ISelectedItemProps<TPersona> {
  onExpandItem?: () => void;
  renderPersonaCoin?: IRenderFunction<TPersona>;
  renderPrimaryText?: IRenderFunction<TPersona>;
}

export interface ISelectedPeopleProps<TPersona extends IExtendedPersonaProps = IExtendedPersonaProps>
  extends IBaseSelectedItemsListProps<TPersona> {
  onExpandGroup?: (item: TPersona) => void;
  removeMenuItemText?: string;
  copyMenuItemText?: string;
  editMenuItemText?: string;
  getEditingItemText?: (item: TPersona) => string;
  onRenderFloatingPicker?: React.ComponentType<Partial<IBaseFloatingPickerProps<TPersona>>>;
  /**
   * @deprecated Use onRenderFloaingPicker to set props instead.
   */
  floatingPickerProps?: IBaseFloatingPickerProps<TPersona>;
}

export class BasePeopleSelectedItemsList<TPersona extends IExtendedPersonaProps = IExtendedPersonaProps> extends BaseSelectedItemsList<
  TPersona,
  ISelectedPeopleProps<TPersona>
> {}

/**
 * Standard People Picker.
 */
export class SelectedPeopleList<TPersona extends IExtendedPersonaProps = IExtendedPersonaProps> extends BasePeopleSelectedItemsList<
  TPersona
> {
  public static defaultProps = {
    onRenderItem: (props: ISelectedPeopleItemProps<IExtendedPersonaProps>) => <ExtendedSelectedItem {...props} />
  };

  protected renderItems = (): JSX.Element[] => {
    const { items } = this.state;
    // tslint:disable-next-line:no-any
    return items.map((item: TPersona, index: number) => this._renderItem(item, index));
  };

  // tslint:disable-next-line:no-any
  private _renderItem(item: TPersona, index: number): JSX.Element {
    const { removeButtonAriaLabel } = this.props;
    const onExpandItem = this.props.onExpandGroup;
    const props = {
      item,
      index,
      key: item.key ? item.key : index,
      selected: this.selection.isIndexSelected(index),
      onRemoveItem: this.removeItem,
      onItemChange: this.onItemChange,
      removeButtonAriaLabel: removeButtonAriaLabel,
      onCopyItem: (itemToCopy: TPersona) => this.copyItems([itemToCopy]),
      onExpandItem: onExpandItem ? () => onExpandItem(item) : undefined,
      menuItems: this._createMenuItems(item)
    };

    const hasContextMenu = props.menuItems.length > 0;
    if (item.isEditing && hasContextMenu) {
      return (
        <EditingItem
          {...props}
          onRenderFloatingPicker={this.props.onRenderFloatingPicker}
          floatingPickerProps={this.props.floatingPickerProps}
          onEditingComplete={this._completeEditing}
          getEditingItemText={this.props.getEditingItemText}
        />
      );
    } else {
      const onRenderItem: (item: ISelectedPeopleItemProps<IExtendedPersonaProps>) => JSX.Element =
        this.props.onRenderItem || SelectedPeopleList.defaultProps.onRenderItem;
      const renderedItem = onRenderItem(props);
      return hasContextMenu ? (
        <SelectedItemWithContextMenu
          renderedItem={renderedItem}
          beginEditing={this._beginEditing}
          menuItems={this._createMenuItems(props.item)}
          item={props.item}
        />
      ) : (
        renderedItem
      );
    }
  }

  private _beginEditing = (item: IExtendedPersonaProps): void => {
    item.isEditing = true;
    this.forceUpdate();
  };

  // tslint:disable-next-line:no-any
  private _completeEditing = (oldItem: any, newItem: any): void => {
    oldItem.isEditing = false;
    this.replaceItem(oldItem, newItem);
  };

  // tslint:disable-next-line:no-any
  private _createMenuItems(item: any): IContextualMenuItem[] {
    const menuItems: IContextualMenuItem[] = [];

    if (this.props.editMenuItemText && this.props.getEditingItemText) {
      menuItems.push({
        key: 'Edit',
        text: this.props.editMenuItemText,
        onClick: (ev: React.MouseEvent<HTMLElement>, menuItem: IContextualMenuItem) => {
          this._beginEditing(menuItem.data);
        },
        data: item
      });
    }

    if (this.props.removeMenuItemText) {
      menuItems.push({
        key: 'Remove',
        text: this.props.removeMenuItemText,
        onClick: (ev: React.MouseEvent<HTMLElement>, menuItem: IContextualMenuItem) => {
          this.removeItem(menuItem.data);
        },
        data: item
      });
    }

    if (this.props.copyMenuItemText) {
      menuItems.push({
        key: 'Copy',
        text: this.props.copyMenuItemText,
        onClick: (ev: React.MouseEvent<HTMLElement>, menuItem: IContextualMenuItem) => {
          if (this.props.onCopyItems) {
            (this.copyItems as (items: IExtendedPersonaProps[]) => void)([menuItem.data] as IExtendedPersonaProps[]);
          }
        },
        data: item
      });
    }

    return menuItems;
  }
}
