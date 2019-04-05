import * as React from 'react';
import { FontSizes, ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { classNamesFunction, styled, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';

type IClassicPickerFooterProps = {
  styles?: IStyleFunctionOrObject<IClassicPickerFooterStyleProps, IClassicPickerFooterStyles>;
  theme?: ITheme;
  text: string;
};
type IClassicPickerFooterStyleProps = {
  theme: ITheme;
};
type IClassicPickerFooterStyles = {
  footer: IStyle;
};

function getClassicPickerFooterStyles(props: IClassicPickerFooterStyleProps): IClassicPickerFooterStyles {
  const { palette } = props.theme;
  return {
    footer: [
      {
        textAlign: 'center',
        padding: '0 12px',
        fontSize: FontSizes.small,
        color: palette.neutralSecondary,
        lineHeight: 30
      }
    ]
  };
}
const getFooterClassNames = classNamesFunction<IClassicPickerFooterStyleProps, IClassicPickerFooterStyles>();
const ClassicPickerFooterInner = ({ theme, styles, text: title }: IClassicPickerFooterProps) => {
  const footerStyles = getFooterClassNames(styles, {
    theme: theme!
  });

  return <div className={footerStyles.footer}>{title}</div>;
};

export const ClassicPickerFooter = styled<IClassicPickerFooterProps, IClassicPickerFooterStyleProps, IClassicPickerFooterStyles>(
  ClassicPickerFooterInner,
  getClassicPickerFooterStyles,
  undefined,
  {
    scope: 'ClassicPickerFooter'
  }
);
