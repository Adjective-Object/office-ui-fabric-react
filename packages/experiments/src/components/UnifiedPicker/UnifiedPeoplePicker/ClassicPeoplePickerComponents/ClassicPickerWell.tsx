// import * as React from 'react';
// import { IUnifiedPickerProps, UnifiedPickerSelectedItemsProps } from '../../UnifiedPicker.types';
// import { IPersona, IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
// import { SelectionZone, SelectionMode } from 'office-ui-fabric-react/lib/Selection';

// type PeoplePickerSelectedItemsWellComponent = IUnifiedPickerProps<IPersona>['onRenderSelectedItems'] & {
//   removeButtonAriaLabel?: string,
// };

// class ClassicPickerSelectedItemsWell<T> extends React.Component<UnifiedPickerSelectedItemsProps<T>> {
//   renderItems(): JSX.Element[] {
//     const { disabled, removeButtonAriaLabel } = this.props;
//     const onRenderItem = this.props.onRenderItem as (props: IPickerItemProps<T>) => JSX.Element;

//     const { items, selectedIndices } = this.state;
//     return items.map((item: any, index: number) =>
//       onRenderItem({
//         item,
//         index,
//         key: item.key ? item.key : index,
//         selected: selectedIndices!.indexOf(index) !== -1,
//         onRemoveItem: () => this.props.onItemsDeleted(item),
//         disabled: disabled,
//         onItemChange: this.onItemChange,
//         removeButtonAriaLabel: removeButtonAriaLabel
//       })
//     );

//   render() {
//     const { selection, selectedItems} = this.props;

//     return  <SelectionZone selection={selection} selectionMode={SelectionMode.multiple}>
//     <div className={classNames.text}>
//       {selectedItems.length > 0 && (
//         <span {/*id={this._ariaMap.selectedItems}*/} className={classNames.itemsWrapper} role={'list'}>
//           {this.renderItems()}
//         </span>
//       )}
//       {this.canAddItems() && (
//         <Autofill
//           spellCheck={false}
//           {...inputProps as any}
//           className={classNames.input}
//           componentRef={this.input}
//           onFocus={this.onInputFocus}
//           onBlur={this.onInputBlur}
//           onInputValueChange={this.onInputChange}
//           suggestedDisplayValue={suggestedDisplayValue}
//           aria-activedescendant={this.getActiveDescendant()}
//           aria-expanded={!!this.state.suggestionsVisible}
//           aria-haspopup="true"
//           aria-describedby={this._ariaMap.selectedItems}
//           autoCapitalize="off"
//           autoComplete="off"
//           role={'combobox'}
//           disabled={disabled}
//           aria-controls={`${suggestionsAvailable} ${selectedSuggestionAlertId}` || undefined}
//           aria-owns={suggestionsAvailable || undefined}
//           aria-autocomplete={'both'}
//           onInputChange={this.props.onInputChange}
//         />
//       )}
//     </div>
//   </SelectionZone>
//   }
// }
