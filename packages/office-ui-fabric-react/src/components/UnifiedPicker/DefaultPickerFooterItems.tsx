import * as React from 'react';
import { UnifiedPicker } from './UnifiedPicker';
import * as styles from './UnifiedPicker.scss';
import { ISuggestionsHeaderFooterProps } from '../FloatingPicker';

export class DefaultPickerFooterItems {
  private pickerInstance: UnifiedPicker<any> | undefined;

  private _items: ISuggestionsHeaderFooterProps[] = [
    {
      renderItem: () => {
        return <div className={styles.defaultPickerFooterItem}>No results</div>;
      },
      shouldShow: () => {
        return (
          this.pickerInstance !== undefined &&
          this.pickerInstance.floatingPicker !== undefined &&
          this.pickerInstance.floatingPicker.current !== null &&
          this.pickerInstance.floatingPicker.current.suggestions.length === 0
        );
      },
      ariaLabel: 'No Results'
    }
  ];

  public get items() {
    return this._items;
  }

  public bindPickerInstance(pickerInstance: UnifiedPicker<any> | undefined) {
    this.pickerInstance = pickerInstance;
  }
}
