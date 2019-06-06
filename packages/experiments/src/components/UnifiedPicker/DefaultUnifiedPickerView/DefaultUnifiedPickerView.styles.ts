import { getGlobalClassNames, hiddenContentStyle, HighContrastSelector } from '../../../Styling';
import { IDefaultUnifiedPickerViewStyleProps, IDefaultUnifiedPickerViewStyles } from './DefaultUnifiedPickerView.types';

const GlobalClassNames = {
  root: 'ms-BasePicker',
  pickerWell: 'ms-BasePicker-pickerWell',
  input: 'ms-BasePicker-input'
};

export function getStyles(props: IDefaultUnifiedPickerViewStyleProps): IDefaultUnifiedPickerViewStyles {
  const { className, theme, disabled } = props;

  if (!theme) {
    throw new Error('theme is undefined or null in base UnifiedPicker getStyles function.');
  }

  const { semanticColors } = theme;
  const { inputBorder, inputBorderHovered, inputFocusBorderAlt } = semanticColors;

  const classNames = getGlobalClassNames(GlobalClassNames, theme);

  // The following lines are to create a semi-transparent color overlay for the disabled state with designer's approval.
  // @todo: investigate the performance cost of the calculation below and apply if negligible. Replacing with a static color for now.
  // const rgbColor: IRGB | undefined = cssColor(palette.neutralQuaternaryAlt);
  // const disabledOverlayColor = rgbColor ? `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.29)` : 'transparent';
  const disabledOverlayColor = 'rgba(218, 218, 218, 0.29)';

  return {
    root: [classNames.root, className],
    pickerWell: [
      classNames.pickerWell,
      {
        display: 'flex',
        position: 'relative',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxSizing: 'border-box',
        minWidth: 180,
        minHeight: 32,
        padding: 1,
        border: `1px solid ${inputBorder}`
      },
      !disabled && {
        selectors: {
          ':hover': {
            borderColor: inputBorderHovered
          },
          ':focus': {
            borderColor: inputFocusBorderAlt
          }
        }
      },
      disabled && {
        borderColor: 'transparent',
        selectors: {
          ':after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: disabledOverlayColor
          },
          [HighContrastSelector]: {
            borderColor: 'GrayText',
            selectors: {
              ':after': {
                background: 'none'
              }
            }
          }
        }
      }
    ],
    input: [
      classNames.input,
      {
        height: 34,
        border: 'none',
        flexGrow: 1,
        outline: 'none',
        padding: '0 6px 0',
        margin: 1
      }
    ],
    screenReaderText: hiddenContentStyle
  };
}
