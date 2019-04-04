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
import { EditingItem, EditingItemFloatingPickerProps } from './Items/EditingItem';

export interface IExtendedPersonaProps extends IPersonaProps {
  key?: React.Key;
  isValid: boolean;
  blockRecipientRemoval?: boolean;
  shouldBlockSelection?: boolean;
  canExpand?: boolean;
  isEditing?: boolean;
}

export interface ISelectedPeopleItemProps<TPersona extends IExtendedPersonaProps = IExtendedPersonaProps>
  extends ISelectedItemProps<TPersona> {
  onExpandItem?: () => void;
  renderPersonaCoin?: IRenderFunction<IPersonaProps>;
  renderPrimaryText?: IRenderFunction<IPersonaProps>;
}

export interface ISelectedPeopleProps<TPersona extends IExtendedPersonaProps = IExtendedPersonaProps>
  extends IBaseSelectedItemsListProps<TPersona> {
  onExpandGroup?: (item: IExtendedPersonaProps) => void;
  removeMenuItemText?: string;
  copyMenuItemText?: string;
  editMenuItemText?: string;
  getEditingItemText?: (item: IExtendedPersonaProps) => string;
  onRenderFloatingPicker?: React.ComponentType<EditingItemFloatingPickerProps<TPersona>>;
  floatingPickerProps?: IBaseFloatingPickerProps<IPersonaProps>;
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
  // tslint:disable-next-line:no-any
  public static defaultProps: any = {
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
    const expandGroup = this.props.onExpandGroup;
    const props = {
      item,
      index,
      key: item.key !== undefined ? item.key : index,
      selected: this.selection.isIndexSelected(index),
      onRemoveItem: () => this.removeItem(item),
      onItemChange: this.onItemChange,
      removeButtonAriaLabel: removeButtonAriaLabel,
      onCopyItem: (itemToCopy: TPersona) => this.copyItems([itemToCopy]),
      onExpandItem: expandGroup ? () => expandGroup(item) : undefined,
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
      // This cast is here because we are guaranteed that onRenderItem is set
      // from static defaultProps
      // TODO: Move this component to composition with required onRenderItem to remove
      // this cast.
      const onRenderItem = this.props.onRenderItem as (props: ISelectedPeopleItemProps) => JSX.Element;
      const renderedItem = onRenderItem(props);
      return hasContextMenu ? (
        <SelectedItemWithContextMenu
          key={props.key}
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

  private _beginEditing = (item: TPersona): void => {
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
            this.copyItems([menuItem.data]);
          }
        },
        data: item
      });
    }

    return menuItems;
  }
}
