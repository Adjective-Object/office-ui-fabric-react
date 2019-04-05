import * as React from 'react';
import { BaseComponent, KeyCodes, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { Autofill } from 'office-ui-fabric-react/lib/Autofill';
import { IInputProps } from 'office-ui-fabric-react/lib/Pickers';
import { IBaseFloatingPickerProps, BaseFloatingPicker } from 'office-ui-fabric-react/lib/FloatingPicker';
import { BaseSelectedItemsList, IBaseSelectedItemsListProps } from 'office-ui-fabric-react/lib/SelectedItemsList';
import { FocusZone, FocusZoneDirection, FocusZoneTabbableElements } from 'office-ui-fabric-react/lib/FocusZone';
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/Selection';

import { getStyles } from './UnifiedPicker.styles';
import { styled } from 'office-ui-fabric-react/lib/Utilities';

import {
  IUnifiedPickerProps,
  IUnifiedPicker,
  UnifiedPickerFocusZoneProps,
  IUnifiedPickerStyleProps,
  IUnifiedPickerStyles
} from './UnifiedPicker.types';
import { PropsOf } from './UnifiedPeoplePicker';

export interface IUnifiedPickerState<T> {
  queryString: string | null;
  selectedItems: T[] | null;
  suggestionItems: T[] | null;
}

const getClassNames = classNamesFunction<IUnifiedPickerStyleProps, IUnifiedPickerStyles>();

const shouldFocusZoneInputLoseFocusOnArrowKey = () => true;

/**
 * The focus zone that is used by default to wrap the whole unified picker
 */
const DefaultUnifiedPickerFocusZone = (overriddenProps: UnifiedPickerFocusZoneProps) => (
  <FocusZone
    shouldInputLoseFocusOnArrowKey={shouldFocusZoneInputLoseFocusOnArrowKey}
    handleTabKey={FocusZoneTabbableElements.all}
    {...overriddenProps}
  />
);

export class UnifiedPickerImpl<T> extends BaseComponent<IUnifiedPickerProps<T>, IUnifiedPickerState<T>> implements IUnifiedPicker<T> {
  public floatingPicker = React.createRef<BaseFloatingPicker<T>>();
  public selectedItemsList = React.createRef<BaseSelectedItemsList<T, IBaseSelectedItemsListProps<T>>>();

  protected root = React.createRef<HTMLDivElement>();
  protected input = React.createRef<Autofill>();
  protected selection: Selection;

  constructor(basePickerProps: IUnifiedPickerProps<T>) {
    super(basePickerProps);

    this.selection = new Selection({ onSelectionChanged: () => this.onSelectionChange() });

    this.state = {
      queryString: '',
      suggestionItems: this.props.suggestionItems ? (this.props.suggestionItems as T[]) : null,
      selectedItems: this.props.defaultSelectedItems
        ? (this.props.defaultSelectedItems as T[])
        : this.props.selectedItems
        ? (this.props.selectedItems as T[])
        : null
    };
  }

  // tslint:disable-next-line:no-any
  public get items(): any {
    return this.state.selectedItems
      ? this.state.selectedItems
      : this.selectedItemsList.current
      ? this.selectedItemsList.current.items
      : null;
  }

  public componentDidMount(): void {
    this.forceUpdate();
  }

  public componentWillReceiveProps(newProps: IUnifiedPickerProps<T>): void {
    if (newProps.selectedItems) {
      this.setState({ selectedItems: newProps.selectedItems });
    }
  }

  public focus(): void {
    if (this.input.current) {
      this.input.current.focus();
    }
  }

  public clearInput(): void {
    if (this.input.current) {
      this.input.current.clear();
    }
  }

  public get inputElement(): HTMLInputElement | null {
    return this.input.current && this.input.current.inputElement;
  }

  public get highlightedItems(): T[] {
    return this.selectedItemsList.current ? this.selectedItemsList.current.highlightedItems() : [];
  }

  public render(): JSX.Element {
    const { className, theme, disabled, styles, inputProps, onRenderFocusZone } = this.props;
    const classNames = getClassNames(styles, {
      theme: theme!,
      disabled,
      className
    });

    const activeDescendant =
      this.floatingPicker.current && this.floatingPicker.current.currentSelectedSuggestionIndex !== -1
        ? 'sug-' + this.floatingPicker.current.currentSelectedSuggestionIndex
        : undefined;
    const FocusZoneComponent: React.ComponentType<UnifiedPickerFocusZoneProps> = onRenderFocusZone || DefaultUnifiedPickerFocusZone;

    return (
      <div ref={this.root} className={classNames.root} onKeyDown={this.onBackspace} onCopy={this.onCopy}>
        <FocusZoneComponent direction={FocusZoneDirection.bidirectional}>
          <SelectionZone selection={this.selection} selectionMode={SelectionMode.multiple}>
            <div className={classNames.pickerWell} role={'list'}>
              {this.props.headerComponent}
              {this.renderSelectedItemsList()}
              {this.canAddItems() && (
                <Autofill
                  {...inputProps as IInputProps}
                  className={classNames.input}
                  ref={this.input}
                  onFocus={this.onInputFocus}
                  onClick={this.onInputClick}
                  onInputValueChange={this.onInputChange}
                  aria-activedescendant={activeDescendant}
                  aria-owns="suggestion-list"
                  aria-expanded={this.floatingPicker.current ? this.floatingPicker.current.isSuggestionsShown : false}
                  aria-haspopup="true"
                  autoCapitalize="off"
                  autoComplete="off"
                  role="combobox"
                  disabled={disabled}
                  onPaste={this.onPaste}
                />
              )}
            </div>
          </SelectionZone>
        </FocusZoneComponent>
        {this.renderFloatingPicker()}
      </div>
    );
  }

  protected onSelectionChange = (): void => {
    this.forceUpdate();
  };

  protected canAddItems(): boolean {
    const { itemLimit } = this.props;
    return itemLimit === undefined || this.items.length < itemLimit;
  }

  protected renderFloatingPicker(): JSX.Element {
    const FloatingPicker: React.ComponentType<Partial<IBaseFloatingPickerProps<T>>> = this.props.onRenderFloatingPicker;
    return (
      <FloatingPicker
        componentRef={this.floatingPicker}
        onChange={this._onSuggestionSelected}
        inputElement={this.input.current ? this.input.current.inputElement : undefined}
        selectedItems={this.items}
        suggestionItems={this.props.suggestionItems ? this.props.suggestionItems : undefined}
        onValidateInput={this.props.onValidateInputQuery}
      />
    );
  }

  protected renderSelectedItemsList(): JSX.Element {
    const SelectedItems: React.ComponentType<Partial<IBaseSelectedItemsListProps<T>>> = this.props.onRenderSelectedItems;
    return (
      <SelectedItems
        componentRef={this.selectedItemsList}
        selection={this.selection}
        selectedItems={this.props.selectedItems ? this.props.selectedItems : undefined}
        onItemsDeleted={this.props.selectedItems ? this.props.onItemsRemoved : undefined}
      />
    );
  }

  protected onInputChange = (value: string): void => {
    this.setState({ queryString: value });
    if (this.floatingPicker.current) {
      this.floatingPicker.current.onQueryStringChanged(value);
    }
  };

  protected onInputFocus = (ev: React.FocusEvent<HTMLInputElement | Autofill>): void => {
    if (this.selectedItemsList.current) {
      this.selectedItemsList.current.unselectAll();
    }

    if (this.props.inputProps && this.props.inputProps.onFocus) {
      this.props.inputProps.onFocus(ev as React.FocusEvent<HTMLInputElement>);
    }
  };

  protected onInputClick = (ev: React.MouseEvent<HTMLInputElement | Autofill>): void => {
    if (this.selectedItemsList.current) {
      this.selectedItemsList.current.unselectAll();
    }

    if (this.floatingPicker.current && this.inputElement) {
      // Update the value if the input value is empty or it is different than the current inputText from the floatingPicker
      const shoudUpdateValue = this.inputElement.value === '' || this.inputElement.value !== this.floatingPicker.current.inputText;
      this.floatingPicker.current.showPicker(shoudUpdateValue);
    }
  };

  // This is protected because we may expect the backspace key to work differently in a different kind of picker.
  // This lets the subclass override it and provide it's own onBackspace. For an example see the BasePickerListBelow
  protected onBackspace = (ev: React.KeyboardEvent<HTMLElement>): void => {
    if (ev.which !== KeyCodes.backspace) {
      return;
    }

    if (this.selectedItemsList.current && this.items.length) {
      if (
        this.input.current &&
        !this.input.current.isValueSelected &&
        this.input.current.inputElement === document.activeElement &&
        (this.input.current as Autofill).cursorLocation === 0
      ) {
        if (this.floatingPicker.current) {
          this.floatingPicker.current.hidePicker();
        }
        ev.preventDefault();
        this.selectedItemsList.current.removeItemAt(this.items.length - 1);
        this._onSelectedItemsChanged();
      } else if (this.selectedItemsList.current.hasSelectedItems()) {
        if (this.floatingPicker.current) {
          this.floatingPicker.current.hidePicker();
        }
        ev.preventDefault();
        this.selectedItemsList.current.removeSelectedItems();
        this._onSelectedItemsChanged();
      }
    }
  };

  protected onCopy = (ev: React.ClipboardEvent<HTMLElement>): void => {
    if (this.selectedItemsList.current) {
      // Pass it down into the selected items list
      this.selectedItemsList.current.onCopy(ev);
    }
  };

  protected onPaste = (ev: React.ClipboardEvent<Autofill | HTMLInputElement>): void => {
    if (this.props.onPaste) {
      const inputText = ev.clipboardData.getData('Text');
      ev.preventDefault();
      this.props.onPaste(inputText);
    }
  };

  protected _onSuggestionSelected = (item: T): void => {
    const currentRenderedQueryString = this.props.currentRenderedQueryString;
    const queryString = this.state.queryString;
    if (currentRenderedQueryString === undefined || currentRenderedQueryString === queryString) {
      const processedItem: T | PromiseLike<T> | null = this.props.onItemSelected ? (this.props.onItemSelected as any)(item) : item;

      if (processedItem === null) {
        return;
      }

      const processedItemObject: T = processedItem as T;
      const processedItemPromiseLike: PromiseLike<T> = processedItem as PromiseLike<T>;

      let newItem: T;
      if (processedItemPromiseLike && processedItemPromiseLike.then) {
        processedItemPromiseLike.then((resolvedProcessedItem: T) => {
          newItem = resolvedProcessedItem;
          this._addProcessedItem(newItem);
        });
      } else {
        newItem = processedItemObject;
        this._addProcessedItem(newItem);
      }
    }
  };

  protected _onSelectedItemsChanged = (): void => {
    this.focus();
  };

  private _addProcessedItem(newItem: T) {
    // If this is a controlled component, call the on item selected callback
    // Otherwise add it to the selectedItemsList
    if (this.props.onItemAdded) {
      this.props.onItemAdded(newItem);
    }

    if (this.selectedItemsList.current) {
      this.selectedItemsList.current.addItems([newItem]);
    }

    if (this.input.current) {
      this.input.current.clear();
    }

    if (this.floatingPicker.current) {
      this.floatingPicker.current.hidePicker();
    }

    this.focus();
  }
}

export const UnifiedPicker: React.StatelessComponent<PropsOf<typeof UnifiedPickerImpl>> = styled(UnifiedPickerImpl, getStyles, undefined, {
  scope: 'UnifiedPicker'
});
