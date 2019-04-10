import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { ISuggestionModel, ITag } from 'office-ui-fabric-react/lib/Pickers';

/** TagItemSuggestion component props */
export interface IDefaultTagPickerSuggestionProps extends ISuggestionModel<ITag> {
  /** Additional CSS class(es) to apply to the TagItemSuggestion div element */
  className?: string;

  /** Call to provide customized styling that will layer on top of the variant rules. */
  styles?: IStyleFunctionOrObject<IDefaultTagPickerStyleProps, IDefaultTagPickerSuggestionStyles>;

  /** Theme provided by High-Order Component. */
  theme?: ITheme;
}

/** The props needed to construct TagItemSuggestion styles. */
export type IDefaultTagPickerStyleProps = Required<Pick<IDefaultTagPickerSuggestionProps, 'theme'>> &
  Pick<IDefaultTagPickerSuggestionProps, 'className'> & {};

export interface IDefaultTagPickerSuggestionStyles {
  /** Refers to the text element of the TagItemSuggestion */
  suggestionTextOverflow?: IStyle;
}
