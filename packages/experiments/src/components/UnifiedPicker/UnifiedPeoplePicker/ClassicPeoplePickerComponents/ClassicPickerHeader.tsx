import * as React from 'react';
import { FontSizes, ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { classNamesFunction, styled, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';

type IClassicPickerHeaderProps = {
  styles?: IStyleFunctionOrObject<IClassicPickerHeaderStyleProps, IClassicPickerHeaderStyles>;
  theme?: ITheme;
  text: string;
};
type IClassicPickerHeaderStyleProps = {
  theme: ITheme;
};
type IClassicPickerHeaderStyles = {
  header: IStyle;
};

function getClassicPickerHeaderStyles(props: IClassicPickerHeaderStyleProps): IClassicPickerHeaderStyles {
  const { palette } = props.theme;
  return {
    header: [
      {
        padding: '0 12px',
        fontSize: FontSizes.small,
        color: palette.themePrimary,
        lineHeight: 40,
        borderBottom: `1px solid ${palette.neutralLight}`
      }
    ]
  };
}
const getHeaderClassNames = classNamesFunction<IClassicPickerHeaderStyleProps, IClassicPickerHeaderStyles>();
const ClassicPickerHeaderInner = ({ theme, styles, text: text }: IClassicPickerHeaderProps) => {
  const headerStyles = getHeaderClassNames(styles, {
    theme: theme!
  });

  return <div className={headerStyles.header}>{text}</div>;
};

export const ClassicPickerHeader = styled<IClassicPickerHeaderProps, IClassicPickerHeaderStyleProps, IClassicPickerHeaderStyles>(
  ClassicPickerHeaderInner,
  getClassicPickerHeaderStyles,
  undefined,
  {
    scope: 'ClassicPickerHeader'
  }
);
