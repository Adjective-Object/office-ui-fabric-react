import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { ISelectedItemProps } from '../../../SelectedItemsList';
import { IButtonStyles } from '../../../Button';

/** TagItem component props */
export interface IDefaultTagItemProps<TTag extends ITag = ITag> extends ISelectedItemProps<TTag> {
  /** Additional CSS class(es) to apply to the TagItem root element. */
  className?: string;

  /**
   * Enable or not focus on TagItem when TagPicker is disabled.
   * @defaultvalue false
   */
  enableTagFocusInDisabledPicker?: boolean;

  /** Call to provide customized styling that will layer on top of the variant rules. */
  styles?: IStyleFunctionOrObject<IDefaultTagItemStyleProps, ITagItemStyles>;

  /** Theme provided by High-Order Component. */
  theme?: ITheme;
}

/** The props needed to construct TagItem styles. */
export type IDefaultTagItemStyleProps = Required<Pick<IDefaultTagItemProps, 'theme'>> &
  Pick<IDefaultTagItemProps, 'className' | 'selected' | 'disabled'> & {};

/** Represents the stylable areas of the TagItem. */
export interface ITagItemStyles {
  /** Root element of picked TagItem */
  root: IStyle;

  /** Refers to the text element of the TagItem already picked. */
  text: IStyle;

  subComponentStyles: ITagItemSubcomponentStyles;
}

export interface ITagItemSubcomponentStyles {
  /** Refers to the cancel action button on a picked TagItem. */
  closeButtonStyles: Partial<IButtonStyles>; // IButtonProps['styles'];
}
