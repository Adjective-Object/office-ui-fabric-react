import * as React from 'react';
import {
  IControlledUnifiedPickerProps,
  IUncontrolledUnifiedPickerProps,
  IUncontrolledUnifiedPicker,
  IControlledUnifiedPicker
} from './UnifiedPicker.types';
import { ControlledUnifiedPicker } from './ControlledUnifiedPicker';
import { UncontrolledUnifiedPicker } from './UncontrolledUnifiedPicker';
import { PropsOf } from './ComposingUnifiedPicker.types';

const isControlledUnifiedPicker = <TSelectedItem, TSuggestedItem>(
  props: IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem> | IUncontrolledUnifiedPickerProps<TSelectedItem, TSuggestedItem>
): props is IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem> => (props as any).selectedItems !== undefined;

type UnifiedPickerResolvedPropType<TSelectedItem, TSuggestedItem> =
  | (IUncontrolledUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
      React.RefAttributes<IUncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem>>)
  | (IControlledUnifiedPickerProps<TSelectedItem, TSuggestedItem> &
      React.RefAttributes<IControlledUnifiedPicker<TSelectedItem, TSuggestedItem>>);

export const UnifiedPicker = React.forwardRef(
  <TSelectedItem, TSuggestedItem>(props: UnifiedPickerResolvedPropType<TSelectedItem, TSuggestedItem>, ref: any) => {
    if (isControlledUnifiedPicker<TSelectedItem, TSuggestedItem>(props)) {
      return <ControlledUnifiedPicker<TSelectedItem, TSuggestedItem> ref={ref} {...props} />;
    } else {
      return <UncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem> ref={ref} {...props} />;
    }
  }
  // Cast back to a generic function type, since typescript <3.4 collapses generics on higher-order functions
  // This was solved by https://github.com/microsoft/TypeScript/pull/30215 in typescript@3.4,
) as <TSelectedItem, TSuggestedItem>(
  props: PropsOf<ControlledUnifiedPicker<TSelectedItem, TSuggestedItem>> | PropsOf<UncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem>>
) => JSX.Element;
export type UnifiedPicker<TSelectedItem, TSuggestedItem = TSelectedItem> =
  | ControlledUnifiedPicker<TSelectedItem, TSuggestedItem>
  | UncontrolledUnifiedPicker<TSelectedItem, TSuggestedItem>;
