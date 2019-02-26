/** @jsx withSlots */
import { withSlots, getSlots } from '../../Foundation';
import { Text } from '../../Text';

import { IUnifiedPickerComponent, IUnifiedPickerProps, IUnifiedPickerSlots } from './UnifiedPicker.types';

export const UnifiedPickerView: IUnifiedPickerComponent['view'] = props => {
  const Slots = getSlots<IUnifiedPickerProps, IUnifiedPickerSlots>(props, {
    root: 'div',
    text: Text
  });

  return (
    <Slots.root>
      <Slots.text />
      <span>Status: {props.status}</span>
    </Slots.root>
  );
};
