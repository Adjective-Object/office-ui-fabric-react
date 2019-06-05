import * as React from 'react';
import { KeyCodes, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { Autofill } from 'office-ui-fabric-react/lib/Autofill';
import { IInputProps } from 'office-ui-fabric-react/lib/Pickers';
import { IFloatingSuggestions } from '../FloatingSuggestions';
import { IControlledSelectedItemsList } from '../SelectedItemsList';
import { FocusZone, FocusZoneDirection, FocusZoneTabbableElements } from 'office-ui-fabric-react/lib/FocusZone';
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/Selection';

import { getStyles } from './UnifiedPicker.styles';
import { styled } from 'office-ui-fabric-react/lib/Utilities';

import {
  UnifiedPickerFocusZoneProps,
  IUnifiedPickerStyleProps,
  IUnifiedPickerStyles,
  IControlledUnifiedPickerProps,
  IControlledUnifiedPicker
} from './UnifiedPicker.types';

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
const shouldFocusZoneInputLoseFocusOnArrowKey = () => true;

const getClassNames = classNamesFunction<IUnifiedPickerStyleProps, IUnifiedPickerStyles>();

/**
 * Internal controlled component for UnifiedPicker.
 *
 * Handles UI state for the picker. Data model is controlled by its parent, UncontrolledUnifiedPicker.
 *
 * Hanldes rendering and hooking up UI.
 * @param props
 */
export const ControlledUnifiedPicker = React.forwardRef(
  styled(
    <TSelectedItem extends any, TSuggestedItem = TSelectedItem>(
      props: IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem>,
      ref: React.Ref<IControlledUnifiedPicker<TSelectedItem, TSuggestedItem>>
    ) => {
      const {
        className,
        styles,
        theme,
        disabled,
        queryString,
        selectedItems,
        canAddItems,
        onSelectedItemsRemoved,
        onQueryStringChange,
        onPaste,
        onSuggestionSelected,
        isQueryForceResolveable,
        inputProps,
        onRenderFocusZone,
        onRenderSelectedItems,
        onRenderFloatingSuggestions
      } = props;
      const classNames = getClassNames(styles, {
        theme: theme!,
        disabled,
        className
      });

      const floatingSuggestionsRef = React.useRef<IFloatingSuggestions<TSelectedItem>>(null);
      const autofillRef = React.useRef<Autofill>(null);
      const selectedItemsRef = React.useRef<IControlledSelectedItemsList>(null);

      const selection = React.useMemo(() => new Selection(), []);

      /**
       * Calls parent onBackspace behaviour when backspace is pressed in the focus zone
       */
      const removeLastSelectedElementOnEmptyInputBackspace = React.useCallback(
        (ev: React.KeyboardEvent<HTMLElement>) => {
          if (ev.which === KeyCodes.backspace && autofillRef.current && autofillRef.current.value === '') {
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
        selection.setAllSelected(false);
        floatingSuggestionsRef.current && floatingSuggestionsRef.current.showPicker();
      }, [floatingSuggestionsRef, selection]);

      const copySelectedItems = React.useCallback(() => {
        selectedItemsRef.current && selectedItemsRef.current.copyItemsInSelectionToClipboard();
      }, [selectedItemsRef]);

      const onAutofillUpdated = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
          onQueryStringChange(ev.target.value);
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
        ref,
        () => ({
          focusInput: () => {
            autofillRef.current && autofillRef.current.focus();
          }
        }),
        [autofillRef]
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
                <SelectedItems selection={selection} selectedItems={selectedItems} onItemsRemoved={onSelectedItemsRemoved} />
                {canAddItems && (
                  <Autofill
                    {...inputProps as IInputProps}
                    ref={autofillRef}
                    className={classNames.input}
                    value={queryString}
                    onChange={onAutofillUpdated}
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
          {canAddItems && autofillRef && autofillRef.current && (
            <FloatingSuggestions
              ref={floatingSuggestionsRef}
              inputElement={autofillRef.current.inputElement}
              onSuggestionSelected={onSuggestionSelected}
              isQueryForceResolveable={isQueryForceResolveable}
            />
          )}
        </>
      );
    },
    getStyles,
    undefined
  )
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TSelectedItem extends any, TSuggestedItem = TSelectedItem>(
  props: IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
    React.RefAttributes<IControlledUnifiedPicker<TSelectedItem, TSuggestedItem>>
) => React.ReactElement;
export type ControlledUnifiedPicker<TSelectedItem, TSuggestedItem> = (
  props: IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
    React.RefAttributes<IControlledUnifiedPicker<TSelectedItem, TSuggestedItem>>
) => React.ReactElement;
