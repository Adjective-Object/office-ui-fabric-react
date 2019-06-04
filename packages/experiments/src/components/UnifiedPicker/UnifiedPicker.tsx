import * as React from 'react';
import { BaseComponent, KeyCodes, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { Autofill } from 'office-ui-fabric-react/lib/Autofill';
import { IInputProps } from 'office-ui-fabric-react/lib/Pickers';
import { IFloatingSuggestionsProps, FloatingSuggestions, IFloatingSuggestions } from '../FloatingSuggestions';
import { ISelectedItemsList } from '../SelectedItemsList';
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
import { PropsOf } from './ComposingUnifiedPicker.types';

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

function isPromiseLike<T>(r: T | PromiseLike<T>): r is PromiseLike<T> {
  return !!(r && (r as { then?: Function }).then);
}

type ControlledUnifiedPickerProps<T> = Pick<
  IUnifiedPickerProps<T>,
  'className' | 'theme' | 'disabled' | 'styles' | 'inputProps' | 'onRenderFocusZone' | 'onRenderSelectedItems' | 'onRenderFloatingSuggestions' | 'isQueryForceResolveable'
> & Pick<
  Required<IUnifiedPickerProps<T>>,
  'selectedItems'
> & {
  onBackspacePressedWithEmptyInput: () => void;
  onCopy: () => void;
  selection: Selection;
  onSelectedItemsRemoved: (removedItems: T[]) => void;
  canAddItems: boolean;
  floatingSuggestionsRef: React.Ref<FloatingSuggestions<T>>,
  onQueryStringChange: () => void,
  onPaste: (ev: React.ClipboardEvent<Autofill | HTMLInputElement>) => void,
  queryString: string,
  onSuggestionSelected: (item: T) => void,
};

/**
 * Internal controlled component for UnifiedPicker.
 *
 * Handles UI state for the picker. Data model is controlled by its parent, UncontrolledUnifiedPicker.
 *
 * Hanldes rendering and hooking up UI.
 * @param props
 */
const ControlledUnifiedPicker = <T extends any>(props: ControlledUnifiedPickerProps<T>) => {
  const {
    className,
    theme,
    disabled,
    styles,
    inputProps,
    onCopy,
    selection,
    selectedItems,
    canAddItems,
    onSelectedItemsRemoved,
    onRenderFocusZone,
    onRenderSelectedItems,
    onRenderFloatingSuggestions,
    queryString,
    onQueryStringChange,
    onPaste,
    onSuggestionSelected,
    isQueryForceResolveable,
    onBackspacePressedWithEmptyInput,
  } = props;
  const classNames = getClassNames(styles, {
    theme: theme!,
    disabled,
    className
  });

  const floatingSuggestionsRef = React.useRef<IFloatingSuggestions<T>>();
  // create ref object as memoized value because Autofill is a class component
  // which only accepts legacy refs. (e.g. not useRef)
  //
  // TODO fix this once Autofill is hookified.
  const autofillRef = React.useMemo(() => React.createRef<Autofill>(), []);

  /**
   * Calls parent onBackspace behaviour when backspace is pressed in the focus zone
   */
  const callParentIfBackspacePressed = React.useCallback(
    (ev: React.KeyboardEvent<HTMLElement>) => {
      if (ev.which === KeyCodes.backspace && autofillRef.current && autofillRef.current.value === '') {
        props.onBackspacePressedWithEmptyInput();

        if (floatingSuggestionsRef.current) {
          floatingSuggestionsRef.current.hidePicker();
        }
      }


    },
    [props.onBackspacePressedWithEmptyInput]
  );

  /**
   * Show the suggestions and clear the selected items in the well when the input is clicked
   */
  const clearSelectionAndShowSuggestions = React.useCallback(() => {
      selection.setAllSelected(false);
      floatingSuggestionsRef.current && floatingSuggestionsRef.current.showPicker();
    }, [floatingSuggestionsRef, selection]
  );

  /**
   * Calculates the global ID of the suggestion that is "active" right now.
   *
   * note: depends on only one suggestion being open at a time on the page.
   * We may need to amend SuggestionStore to support prefixed ID spaces for
   * activeDescendant.
   */
  const activeDescendant = React.useMemo(() =>
    floatingSuggestionsRef.current && floatingSuggestionsRef.current.currentSelectedSuggestionIndex !== -1
      ? 'sug-' + floatingSuggestionsRef.current.currentSelectedSuggestionIndex
      : undefined, [
      floatingSuggestionsRef,
      floatingSuggestionsRef.current && floatingSuggestionsRef.current.currentSelectedSuggestionIndex
    ]);

  const FocusZoneComponent = onRenderFocusZone || DefaultUnifiedPickerFocusZone;
  const FloatingSuggestions = onRenderFloatingSuggestions;
  const SelectedItems = onRenderSelectedItems;

  return (
    <>
      <FocusZoneComponent
        className={classNames.root}
        direction={FocusZoneDirection.bidirectional}
        onKeyDown={callParentIfBackspacePressed}
        onCopy={onCopy}
      >
        <SelectionZone selection={selection} selectionMode={SelectionMode.multiple}>
          <div className={classNames.pickerWell} role={'list'}>
          <SelectedItems
              selection={selection}
              selectedItems={selectedItems}
              onItemsRemoved={onSelectedItemsRemoved}
            />
            {canAddItems && (
              <Autofill
                {...inputProps as IInputProps}
                ref={autofillRef}
                className={classNames.input}
                value={queryString}
                onChange={onQueryStringChange}
                onFocus={clearSelectionAndShowSuggestions}
                onClick={clearSelectionAndShowSuggestions}
                onInputValueChange={onQueryStringChange}
                aria-activedescendant={activeDescendant}
                aria-owns="suggestion-list"
                aria-expanded={floatingSuggestionsRef.current ? floatingSuggestionsRef.current.isSuggestionsShown : false}
                aria-haspopup="true"
                autoCapitalize="off"
                autoComplete="off"
                role="combobox"
                disabled={disabled}
                onPaste={onPaste}
              />
            )}
          </div>
        </SelectionZone>
      </FocusZoneComponent>
      {canAddItems && autofillRef && autofillRef.current && <FloatingSuggestions
        ref={floatingSuggestionsRef}
        inputElement={autofillRef.current.inputElement}
        onSuggestionSelected={onSuggestionSelected}
        isQueryForceResolveable={isQueryForceResolveable}
      />}
    </>
  );
};

const UncontrolledUnifiedPicker = React.forwardRef(<T extends any>(props: IUnifiedPickerProps<T>) => {
  const { defaultSelectedItems, defaultQueryString } = props;

  const [selectedItems, setSelectedItems] = React.useState(defaultSelectedItems || []);
  const [queryString, updateQueryString] = React.useState(defaultQueryString || '');
  const selection = React.useMemo(() => new Selection(), []);

  const removeLastItem = React.useCallback(() => {
    if (selectedItems.length) {
      setSelectedItems(selectedItems.slice(0, selectedItems.length - 1));
    }
  }, [selectedItems]);

  const onSelectedItemsRemoved = React.useCallback((removedItems: T[]) => {
    console.log('unifiedPicker onSelectedItemsRemoved called', removedItems);
    // Update internal state if it is tracked at all
      const nextSelectedItems = selectedItems.filter(i => removedItems.indexOf(i) === -1);
      if (nextSelectedItems.length !== selectedItems.length - removedItems.length) {
        console.error('UnifiedPicker onSelectedItemsRemoved called on some item not in the current state');
      }
      setSelectedItems(nextSelectedItems);
  }, [selectedItems])

  const onPaste = React.useCallback((ev: React.ClipboardEvent<Autofill | HTMLInputElement>) => {
    if (this.props.onPaste) {
      const inputText = ev.clipboardData.getData('Text');
      ev.preventDefault();
      this.props.onPaste(inputText);
    }
  })

  const onCopy = React.useCallback(() => {
    // TODO call into SelecteditemsList.
  }, [selectedItems]);

  return <ControlledUnifiedPicker
    // state
    selection={selection}
    selectedItems={selectedItems}
    queryString={queryString}
    canAddItems={props.itemLimit === undefined || selectedItems.length < props.itemLimit}
    // state manipulation callbacks
    onBackspacePressedWithEmptyInput={removeLastItem}
    onSelectedItemsRemoved={onSelectedItemsRemoved}
    onQueryStringChange={updateQueryString}
    onCopy={onCopy}
    // Styling props
    className={props.className}
    theme={props.theme}
    disabled={props.disabled}
    styles={props.styles}
    // This prop bag should be DI'd out
    inputProps={props.inputProps}
    // Render props
    onRenderFocusZone={props.onRenderFocusZone}
    onRenderSelectedItems={props.onRenderSelectedItems}
    onRenderFloatingSuggestions={props.onRenderFloatingSuggestions}
    // ---

    onPaste={props.onPaste}
    onSuggestionSelected={props.onSuggestionSelected}
    isQueryForceResolveable={props.isQueryForceResolveable}
  />
})








































export class UnifiedPickerImpl<T> extends BaseComponent<IUnifiedPickerProps<T>, IUnifiedPickerState<T>> implements IUnifiedPicker<T> {
  /**
   * This should be private but is public for tests
   */
  public floatingPicker = React.createRef<FloatingSuggestions<T>>();

  /**
   * This should be private but is public for tests
   */
  public selectedItemsList = React.createRef<ISelectedItemsList<T>>();

  private input = React.createRef<Autofill>();
  private selection: Selection;

  constructor(basePickerProps: IUnifiedPickerProps<T>) {
    super(basePickerProps);

    this.selection = new Selection({ onSelectionChanged: () => this.onSelectionChange() });

    this.state = {
      queryString: '',
      suggestionItems: this.props.suggestionItems || null,
      selectedItems: this.props.defaultSelectedItems || (this.props.selectedItems ? null : [])
    };
  }

  public componentDidMount(): void {
    // TODO this doesn't work when mounted in a new react root on initial render
    // (ref timing issues)
    // pls fix so tests work.
    this.forceUpdate();
  }

  public componentWillReceiveProps(newProps: IUnifiedPickerProps<T>): void {
    // Only track state if the component was initialized with some defaultSelectedItems
    // (e.g. we intended for this component to be uncontrolled & it became controlled)
    //
    // TODO this might not be a valid lifecyle step?
    if (this.state.selectedItems && newProps.selectedItems) {
      this.setState({ selectedItems: newProps.selectedItems });
    }
  }

  public get value(): T[] {
    return this.state.selectedItems || (this.selectedItemsList.current && this.selectedItemsList.current.itemsInSelection) || [];
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
      <>
        <FocusZoneComponent
          className={classNames.root}
          direction={FocusZoneDirection.bidirectional}
          onKeyDown={this.onBackspace}
          onCopy={this.onCopy}
        >
          <SelectionZone selection={this.selection} selectionMode={SelectionMode.multiple}>
            <div className={classNames.pickerWell} role={'list'}>
              {this._renderSelectedItemsList()}
              {this._canAddItems() && (
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
        {this._renderFloatingPicker()}
      </>
    );
  }

  /**
   * Input elmeent for the picker (the input from the Autofill)
   *
   * TODO i think this should be private
   */
  public get inputElement(): HTMLInputElement | null {
    return this.input.current && this.input.current.inputElement;
  }

  private onSelectionChange = (): void => {
    this.forceUpdate();
  };

  private _canAddItems(): boolean {
    const { itemLimit } = this.props;
    return itemLimit === undefined || this.value.length < itemLimit;
  }

  private _renderFloatingPicker(): JSX.Element {
    const FloatingPicker: React.ComponentType<Partial<IFloatingSuggestionsProps<T>>> = this.props.onRenderFloatingSuggestions;
    return (
      <FloatingPicker
        ref={this.floatingPicker}
        onSuggestionSelected={this._onSuggestionSelected}
        inputElement={this.inputElement}
        suggestionItems={this.props.suggestionItems ? this.props.suggestionItems : undefined}
        isQueryForceResolveable={this.props.isQueryForceResolveable}
      />
    );
  }

  private _renderSelectedItemsList(): JSX.Element {
    const SelectedItems = this.props.onRenderSelectedItems;
    return (
    );
  }

  private _onSelectedItemsRemoved = (removedItems: T[]) => {
    console.log('unifiedPicker onSelectedItemsRemoved called', removedItems);
    // Update internal state if it is tracked at all
    if (this.state.selectedItems !== null) {
      const nextSelectedItems = this.state.selectedItems.filter(i => removedItems.indexOf(i) === -1);
      if (nextSelectedItems.length !== this.state.selectedItems.length - removedItems.length) {
        console.error('UnifiedPicker _onSelectedItemRemoved called on an item not in the current state');
      }
      this.setState({
        selectedItems: nextSelectedItems
      });
    }

    if (this.props.onItemsRemoved) {
      this.props.onItemsRemoved(removedItems);
    }
  };

  private onInputChange = (value: string): void => {
    this.setState({ queryString: value });
    if (this.floatingPicker.current) {
      this.floatingPicker.current.onQueryStringChanged(value);
    }
  };

  private onInputFocus = (ev: React.FocusEvent<HTMLInputElement | Autofill>): void => {
    if (this.selectedItemsList.current) {
      this.selectedItemsList.current.unselectAll();
    }

    if (this.props.inputProps && this.props.inputProps.onFocus) {
      this.props.inputProps.onFocus(ev as React.FocusEvent<HTMLInputElement>);
    }
  };

  private onInputClick = (ev: React.MouseEvent<HTMLInputElement | Autofill>): void => {
    if (this.selectedItemsList.current) {
      this.selectedItemsList.current.unselectAll();
    }

    if (this.floatingPicker.current && this.inputElement) {
      // Update the value if the input value is empty or it is different than the current inputText from the floatingPicker
      const shoudUpdateValue = this.inputElement.value === '' || this.inputElement.value !== this.floatingPicker.current.inputText;
      this.floatingPicker.current.showPicker(shoudUpdateValue);
    }
  };

  // This is private because we may expect the backspace key to work differently in a different kind of picker.
  // This lets the subclass override it and provide it's own onBackspace. For an example see the BasePickerListBelow
  private onBackspace = (ev: React.KeyboardEvent<HTMLElement>): void => {
    if (ev.which !== KeyCodes.backspace) {
      return;
    }

    // if the autofill was not empty, the backspace was for typing. ignore it.
    if (this.inputElement && this.inputElement.value !== '') {
      return;
    }

    // Dismiss the picker and remove the last item in the list
    if (this.state.selectedItems && this.state.selectedItems.length) {
      const removedItem = this.state.selectedItems[this.state.selectedItems.length - 1];
      this.setState({
        selectedItems: this.state.selectedItems.slice(0, this.state.selectedItems.length - 1)
      });

      if (this.props.onItemsRemoved) {
        this.props.onItemsRemoved([removedItem]);
      }
    }

    if (this.floatingPicker.current) {
      this.floatingPicker.current.hidePicker();
    }
  };

  private onPaste = (ev: React.ClipboardEvent<Autofill | HTMLInputElement>): void => {
    if (this.props.onPaste) {
      const inputText = ev.clipboardData.getData('Text');
      ev.preventDefault();
      this.props.onPaste(inputText);
    }
  };

  private _onSuggestionSelected = (item: T): void => {
    const currentRenderedQueryString = this.props.currentRenderedQueryString;
    const queryString = this.state.queryString;
    if (currentRenderedQueryString === undefined || currentRenderedQueryString === queryString) {
      const processedItem: T | PromiseLike<T> | null = this.props.onItemSelected ? (this.props.onItemSelected as any)(item) : item;

      if (processedItem === null) {
        return;
      }

      let newItem: T;
      if (isPromiseLike(processedItem)) {
        processedItem.then((resolvedProcessedItem: T) => {
          newItem = resolvedProcessedItem;
          this._addItem(newItem);
        });
      } else {
        this._addItem(processedItem);
      }
    }
  };

  private _addItem(newItem: T) {
    // If this is a controlled component, call the on item selected callback
    // Otherwise add it to the selectedItemsList
    if (this.props.onItemAdded) {
      this.props.onItemAdded(newItem);
    }

    // Update the state representation if we've been maintaining one.
    if (this.state.selectedItems) {
      this.setState({
        selectedItems: this.state.selectedItems.concat([newItem])
      });
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
