import { IUnifiedPickerProps, IUnifiedPickerViewProps } from './UnifiedPicker.types';
import { BaseState } from '../../utilities/BaseState';

// Internal state will most likely include a subset of your ViewProps. This template just equates them to start with.
export type IUnifiedPickerState = IUnifiedPickerViewProps;

export class UnifiedPickerState extends BaseState<IUnifiedPickerProps, IUnifiedPickerViewProps, IUnifiedPickerState> {
  constructor(props: UnifiedPickerState['props']) {
    super(props, {
      // Mark controlledProps to ensure that they get priority when provided as a component prop.
      // For props not marked controlled, component state will get priority over component props.
      controlledProps: ['text']
    });

    this.state = {
      text: props.defaultText || 'Default Text',
      status: 'State Text'
    };
  }
}
