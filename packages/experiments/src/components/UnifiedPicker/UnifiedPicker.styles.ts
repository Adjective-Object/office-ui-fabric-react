import { IUnifiedPickerComponent, IUnifiedPickerStylesReturnType, IUnifiedPickerTokenReturnType } from './UnifiedPicker.types';
import { getGlobalClassNames } from '../../Styling';

const GlobalClassNames = {
  root: 'ms-UnifiedPicker',
  text: 'ms-UnifiedPicker-text'
};

const baseTokens: IUnifiedPickerComponent['tokens'] = {
  textColor: 'blue'
};

const warningTokens: IUnifiedPickerComponent['tokens'] = {
  textColor: 'red'
};

export const UnifiedPickerTokens: IUnifiedPickerComponent['tokens'] = (props, theme): IUnifiedPickerTokenReturnType => [
  baseTokens,
  props.warning && warningTokens
];

export const UnifiedPickerStyles: IUnifiedPickerComponent['styles'] = (props, theme, tokens): IUnifiedPickerStylesReturnType => {
  const classNames = getGlobalClassNames(GlobalClassNames, theme);

  return {
    root: [
      classNames.root,
      {
        borderWidth: '1px',
        borderStyle: 'solid',
        margin: 8,
        padding: 8
      }
    ],
    text: [
      classNames.text,
      {
        color: tokens.textColor
      }
    ]
  };
};
