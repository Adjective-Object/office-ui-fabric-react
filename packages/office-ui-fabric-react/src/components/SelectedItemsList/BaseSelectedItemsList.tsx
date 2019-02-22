import * as React from 'react';
import { BaseComponent } from '../../Utilities';
import { Selection } from '../../Selection';

import { IBaseSelectedItemsList, IBaseSelectedItemsListProps, ISelectedItemProps } from './BaseSelectedItemsList.types';

export interface IBaseSelectedItemsListState<TItem> {
  items: TItem[];
}

export class BaseSelectedItemsList<TItem, TProps extends IBaseSelectedItemsListProps<TItem> = IBaseSelectedItemsListProps<TItem>>
  extends BaseComponent<TProps, IBaseSelectedItemsListState<TItem>>
  implements IBaseSelectedItemsList<TItem> {
  protected root: HTMLElement;
  protected selection: Selection;

  constructor(basePickerProps: TProps) {
    super(basePickerProps);

    const items: TItem[] = basePickerProps.selectedItems || basePickerProps.defaultSelectedItems || [];
    this.state = {
      items: items
    };

    // Create a new selection if one is not specified
    this.selection = this.props.selection
      ? (this.props.selection as Selection)
      : new Selection({ onSelectionChanged: this.onSelectionChanged });
  }

  public get items(): TItem[] {
    return this.state.items || [];
  }

  public addItems = (items: TItem[]): void => {
    // tslint:disable-next-line:no-any
    const processedItems: TItem[] | PromiseLike<TItem[]> = this.props.onItemSelected ? (this.props.onItemSelected as any)(items) : items;

    const processedItemObjects: TItem[] = processedItems as TItem[];
    const processedItemPromiseLikes: PromiseLike<TItem[]> = processedItems as PromiseLike<TItem[]>;

    if (processedItemPromiseLikes && processedItemPromiseLikes.then) {
      processedItemPromiseLikes.then((resolvedProcessedItems: TItem[]) => {
        const newItems: TItem[] = this.items.concat(resolvedProcessedItems);
        this.updateItems(newItems);
      });
    } else {
      const newItems: TItem[] = this.items.concat(processedItemObjects);
      this.updateItems(newItems);
    }
  };

  public removeItemAt = (index: number): void => {
    const { items } = this.state;

    if (this._canRemoveItem(items[index])) {
      if (index > -1) {
        if (this.props.onItemsDeleted) {
          (this.props.onItemsDeleted as (item: TItem[]) => void)([items[index]]);
        }

        const newItems = items.slice(0, index).concat(items.slice(index + 1));
        this.updateItems(newItems);
      }
    }
  };

  public removeItem = (item: ISelectedItemProps<TItem>): void => {
    const { items } = this.state;
    const index: number = items.indexOf(item.item);

    this.removeItemAt(index);
  };

  // tslint:disable-next-line:no-any
  public removeItems = (itemsToRemove: any[]): void => {
    const { items } = this.state;
    const itemsCanRemove = itemsToRemove.filter((item: any) => this._canRemoveItem(item));
    // tslint:disable-next-line:no-any
    const newItems: TItem[] = items.filter((item: any) => itemsCanRemove.indexOf(item) === -1);
    const firstItemToRemove = itemsCanRemove[0];
    const index: number = items.indexOf(firstItemToRemove);

    if (this.props.onItemsDeleted) {
      (this.props.onItemsDeleted as (item: TItem[]) => void)(itemsCanRemove);
    }

    this.updateItems(newItems, index);
  };

  public removeSelectedItems(): void {
    if (this.state.items.length && this.selection.getSelectedCount() > 0) {
      this.removeItems(this.selection.getSelection());
    }
  }

  /**
   * Controls what happens whenever there is an action that impacts the selected items.
   * If selectedItems is provided as a property then this will act as a controlled component and it will not update it's own state.
   */
  public updateItems(items: TItem[], focusIndex?: number): void {
    if (this.props.selectedItems) {
      // If the component is a controlled component then the controlling component will need to pass the new props
      this.onChange(items);
    } else {
      this.setState({ items: items }, () => {
        this._onSelectedItemsUpdated(items, focusIndex);
      });
    }
  }

  public onCopy = (ev: React.ClipboardEvent<HTMLElement>): void => {
    if (this.props.onCopyItems && this.selection.getSelectedCount() > 0) {
      const selectedItems: TItem[] = this.selection.getSelection() as TItem[];
      this.copyItems(selectedItems);
    }
  };

  public hasSelectedItems(): boolean {
    return this.selection.getSelectedCount() > 0;
  }

  public unselectAll(): void {
    this.selection.setAllSelected(false);
  }

  public highlightedItems(): TItem[] {
    return this.selection.getSelection() as TItem[];
  }

  public componentWillUpdate(newProps: TProps, newState: IBaseSelectedItemsListState<TItem>): void {
    if (newState.items && newState.items !== this.state.items) {
      this.selection.setItems(newState.items);
    }
  }

  public componentDidMount(): void {
    this.selection.setItems(this.state.items);
  }

  public componentWillReceiveProps(newProps: TProps): void {
    const newItems = newProps.selectedItems;

    if (newItems) {
      this.setState({ items: newItems });
    }

    if (newProps.selection) {
      this.selection = newProps.selection;
    }
  }

  // tslint:disable-next-line:no-any
  public render(): any {
    return this.renderItems();
  }

  protected renderItems = (): JSX.Element[] => {
    const { removeButtonAriaLabel } = this.props;
    const onRenderItem = this.props.onRenderItem as (props: ISelectedItemProps<TItem>) => JSX.Element;

    const { items } = this.state;
    // tslint:disable-next-line:no-any
    return items.map((item: any, index: number) =>
      onRenderItem({
        item,
        index,
        key: item.key ? item.key : index,
        selected: this.selection.isIndexSelected(index),
        onRemoveItem: () => this.removeItem(item),
        onItemChange: this.onItemChange,
        removeButtonAriaLabel: removeButtonAriaLabel,
        onCopyItem: (itemToCopy: TItem) => this.copyItems([itemToCopy])
      })
    );
  };

  protected onSelectionChanged = (): void => {
    this.forceUpdate();
  };

  protected onChange(items?: TItem[]): void {
    if (this.props.onChange) {
      (this.props.onChange as (items?: TItem[]) => void)(items);
    }
  }

  protected onItemChange = (changedItem: TItem, index: number): void => {
    const { items } = this.state;

    if (index >= 0) {
      const newItems: TItem[] = items;
      newItems[index] = changedItem;

      this.updateItems(newItems);
    }
  };

  protected copyItems(items: TItem[]): void {
    if (this.props.onCopyItems) {
      // tslint:disable-next-line:no-any
      const copyText = (this.props.onCopyItems as any)(items);

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
    }
  }

  private _onSelectedItemsUpdated(items?: TItem[], focusIndex?: number): void {
    this.onChange(items);
  }

  private _canRemoveItem(item: TItem): boolean {
    return !this.props.canRemoveItem || this.props.canRemoveItem(item);
  }
}
