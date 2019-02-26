import { UnifiedPickerView } from './UnifiedPicker.view';
import { UnifiedPickerStyles, UnifiedPickerTokens } from './UnifiedPicker.styles';
import { UnifiedPickerState } from './UnifiedPicker.state';
import { IUnifiedPickerProps } from './UnifiedPicker.types';
import { createComponent } from '../../Foundation';

export const UnifiedPicker: React.StatelessComponent<IUnifiedPickerProps> = createComponent({
  displayName: 'UnifiedPicker',
  view: UnifiedPickerView,
  state: UnifiedPickerState,
  styles: UnifiedPickerStyles,
  tokens: UnifiedPickerTokens
});
