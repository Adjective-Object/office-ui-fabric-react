import * as React from 'react';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { UnifiedPeoplePickerProps } from './UnifiedPeoplePicker.types';
import { DefaultPeopleSuggestionsItem } from '../../FloatingSuggestions/FloatingPeopleSuggestions/defaults/DefaultPeopleSuggestionsItem';
import { useDefaultComposedUnifiedPickerView } from '../DefaultUnifiedPickerView/Composing/useDefaultComposedUnifiedPickerView';
import { SelectedPersona } from '../../SelectedItemsList';
import { IUnifiedPicker, IUnifiedPickerViewProps } from '../UnifiedPicker.types';
import { IDefaultUnifiedPickerView } from '../DefaultUnifiedPickerView/DefaultUnifiedPickerView.types';
import { UnifiedPicker } from '../UnifiedPicker';

type PickerRef<A, B> = IUnifiedPicker<A, B, IDefaultUnifiedPickerView<A, B>>;

export const UnifiedPeoplePicker = <TSelectedPersona extends IPersonaProps, TSuggestedPersona extends IPersonaProps = TSelectedPersona>(
  props: UnifiedPeoplePickerProps<TSelectedPersona, TSuggestedPersona>
) => {
  type ViewRefType = IDefaultUnifiedPickerView<TSelectedPersona, TSuggestedPersona>;
  type ViewComponentType = React.ComponentType<
    IUnifiedPickerViewProps<TSelectedPersona, TSuggestedPersona> & React.RefAttributes<ViewRefType>
  >;

  const PickerView: ViewComponentType = useDefaultComposedUnifiedPickerView<TSelectedPersona, TSuggestedPersona>({
    ...props,
    onRenderSuggestionItem: props.onRenderSuggestionItem || DefaultPeopleSuggestionsItem,
    onRenderSelectedItem: props.onRenderSelectedItem || SelectedPersona
  });

  return <UnifiedPicker<TSelectedPersona, TSuggestedPersona, ViewRefType> {...props} view={PickerView} />;
};
export type UnifiedPeoplePicker<T1 extends IPersonaProps, T2 extends IPersonaProps = T1> = React.ComponentType<
  UnifiedPeoplePickerProps<T1, T2> & React.RefAttributes<PickerRef<T1, T2>>
>;
(UnifiedPeoplePicker as any).displayName = 'UnifiedPeoplePicker';
