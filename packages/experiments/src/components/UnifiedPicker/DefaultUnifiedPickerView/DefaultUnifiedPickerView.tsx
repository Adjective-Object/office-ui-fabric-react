import * as React from 'react';
import { KeyCodes, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { IInputProps } from 'office-ui-fabric-react/lib/Pickers';
import { IFloatingSuggestions } from '../../FloatingSuggestions';
import { IControlledSelectedItemsList } from '../../SelectedItemsList';
import { FocusZone, FocusZoneDirection, FocusZoneTabbableElements } from 'office-ui-fabric-react/lib/FocusZone';
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/Selection';

import { getStyles } from './DefaultUnifiedPickerView.styles';
import { styled } from 'office-ui-fabric-react/lib/Utilities';

import {
  IDefaultUnifiedPickerViewProps,
  DefaultUnifiedPickerViewFocusZoneProps,
  IDefaultUnifiedPickerViewStyleProps,
  IDefaultUnifiedPickerViewStyles
} from './DefaultUnifiedPickerView.types';

/**
 * The focus zone that is used by default to wrap the whole unified picker
 */
const DefaultUnifiedPickerFocusZone = (overriddenProps: DefaultUnifiedPickerViewFocusZoneProps) => (
  <FocusZone
    shouldInputLoseFocusOnArrowKey={shouldFocusZoneInputLoseFocusOnArrowKey}
    handleTabKey={FocusZoneTabbableElements.all}
    {...overriddenProps}
  />
);
const shouldFocusZoneInputLoseFocusOnArrowKey = () => true;

const getClassNames = classNamesFunction<IDefaultUnifiedPickerViewStyleProps, IDefaultUnifiedPickerViewStyles>();

/**
 * Internal controlled component for UnifiedPicker.
 *
 * Handles UI state for the picker. Data model is controlled by its parent, UncontrolledUnifiedPicker.
 */
export const DefaultUnifiedPickerView = styled(
  React.memo(
    <TSelectedItem extends any, TSuggestedItem = TSelectedItem>(props: IDefaultUnifiedPickerViewProps<TSelectedItem, TSuggestedItem>) => {
      const {
        className,
        styles,
        theme,
        disabled,
        queryString,
        selectedItems,
        canAddItems,
        onSelectedItemsRemoved,
        onSelectedItemChanged,
        onQueryStringChange,
        onPaste,
        onSuggestionSelected,
        isQueryForceResolveable,
        inputProps,
        onRenderFocusZone,
        onRenderSelectedItems,
        onRenderFloatingSuggestions
      } = props;
      console.log('rendering default view');
      const classNames = getClassNames(styles, {
        theme: theme!,
        disabled,
        className
      });

      const floatingSuggestionsRef = React.useRef<IFloatingSuggestions<TSuggestedItem>>(null);
      const inputRef = React.useRef<HTMLInputElement>(null);
      const selectedItemsRef = React.useRef<IControlledSelectedItemsList>(null);

      const selection = React.useMemo(() => new Selection(), []);

      /**
       * Calls parent onBackspace behaviour when backspace is pressed in the focus zone
       */
      const removeLastSelectedElementOnEmptyInputBackspace = React.useCallback(
        (ev: React.KeyboardEvent<HTMLElement>) => {
          if (ev.which === KeyCodes.backspace && inputRef.current && inputRef.current.value === '') {
            if (selectedItems.length) {
              onSelectedItemsRemoved([selectedItems[selectedItems.length - 1]]);
            }

            if (floatingSuggestionsRef.current) {
              floatingSuggestionsRef.current.hidePicker();
            }
          }
        },
        [props.onSelectedItemsRemoved]
      );

      /**
       * Show the suggestions and clear the selected items in the well when the input is clicked
       */
      const clearSelectionAndShowSuggestions = React.useCallback(() => {
        console.log('!clearSelectionAndShowSuggestions');
        selection.setAllSelected(false);
        floatingSuggestionsRef.current && floatingSuggestionsRef.current.showPicker();
      }, [floatingSuggestionsRef, selection]);

      const copySelectedItems = React.useCallback(() => {
        selectedItemsRef.current && selectedItemsRef.current.copyItemsInSelectionToClipboard();
      }, [selectedItemsRef]);

      const onInputValueChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
          if (disabled) {
            return;
          }
          const newValue = ev.target.value;
          onQueryStringChange(newValue);
          floatingSuggestionsRef.current && floatingSuggestionsRef.current.onQueryStringChanged(newValue);
        },
        [onQueryStringChange]
      );

      /**
       * Calculates the global ID of the suggestion that is "active" right now.
       *
       * note: depends on only one suggestion being open at a time on the page.
       * We may need to amend SuggestionStore to support prefixed ID spaces for
       * activeDescendant.
       */
      const activeDescendant = React.useMemo(
        () =>
          floatingSuggestionsRef.current && floatingSuggestionsRef.current.currentSelectedSuggestionIndex !== -1
            ? 'sug-' + floatingSuggestionsRef.current.currentSelectedSuggestionIndex
            : undefined,
        [floatingSuggestionsRef, floatingSuggestionsRef.current && floatingSuggestionsRef.current.currentSelectedSuggestionIndex]
      );

      /**
       * Imperative handle to this component
       */
      React.useImperativeHandle(
        props.componentRef,
        () => ({
          focusInput: () => {
            inputRef.current && inputRef.current.focus();
          }
        }),
        [inputRef]
      );

      const FocusZoneComponent = onRenderFocusZone || DefaultUnifiedPickerFocusZone;
      const FloatingSuggestions = onRenderFloatingSuggestions;
      const SelectedItems = onRenderSelectedItems;

      return (
        <>
          <FocusZoneComponent
            className={classNames.root}
            direction={FocusZoneDirection.bidirectional}
            onKeyDown={removeLastSelectedElementOnEmptyInputBackspace}
            onCopy={copySelectedItems}
          >
            <SelectionZone selection={selection} selectionMode={SelectionMode.multiple}>
              <div className={classNames.pickerWell} role={'list'}>
                <SelectedItems
                  selection={selection}
                  selectedItems={selectedItems}
                  onItemsRemoved={onSelectedItemsRemoved}
                  onItemChange={onSelectedItemChanged}
                />
                {canAddItems && (
                  <input
                    type="text"
                    {...inputProps as IInputProps}
                    ref={inputRef}
                    className={classNames.input}
                    value={queryString}
                    onInput={onInputValueChange}
                    onFocus={clearSelectionAndShowSuggestions}
                    onClick={clearSelectionAndShowSuggestions}
                    aria-activedescendant={activeDescendant}
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
          {canAddItems && inputRef && inputRef.current && (
            <FloatingSuggestions
              componentRef={floatingSuggestionsRef}
              inputElement={inputRef.current}
              onSuggestionSelected={onSuggestionSelected}
              isQueryForceResolveable={isQueryForceResolveable}
            />
          )}
        </>
      );
    }
  ),
  getStyles
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TSelectedItem, TSuggestedItem>(props: IDefaultUnifiedPickerViewProps<TSelectedItem, TSuggestedItem>) => React.ReactElement;
export type DefaultUnifiedPickerView<TSelectedItem, TSuggestedItem> = (
  props: IDefaultUnifiedPickerViewProps<TSelectedItem, TSuggestedItem>
) => React.ReactElement;
(DefaultUnifiedPickerView as any).displayName = 'DefaultUnifiedPickerView';
