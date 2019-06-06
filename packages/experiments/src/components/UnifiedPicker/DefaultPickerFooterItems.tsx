// import * as React from 'react';
// import { UnifiedPickerImpl } from './UnifiedPicker';
// import { ISuggestionsHeaderFooterProps } from '../../FloatingSuggestions';

// /**
//  * Hacking around the picker header/footer items in order to
//  * keep the reference to the footer items consistent between re-renders.
//  */
// export class DefaultPickerFooterItems {
//   private pickerInstance: UnifiedPickerImpl<any> | undefined;

//   private _items: ISuggestionsHeaderFooterProps[] = [
//     {
//       renderItem: () => {
//         return <div className={'//TODO set up css in js for the default items'}>No results</div>;
//       },
//       shouldShow: () => {
//         return (
//           this.pickerInstance !== undefined &&
//           this.pickerInstance.floatingPicker !== undefined &&
//           this.pickerInstance.floatingPicker.current !== null &&
//           this.pickerInstance.floatingPicker.current.suggestions.length === 0
//         );
//       },
//       ariaLabel: 'No Results'
//     }
//   ];

//   public get items() {
//     return this._items;
//   }

//   public bindPickerInstance(pickerInstance: UnifiedPickerImpl<any> | undefined) {
//     this.pickerInstance = pickerInstance;
//   }
// }
