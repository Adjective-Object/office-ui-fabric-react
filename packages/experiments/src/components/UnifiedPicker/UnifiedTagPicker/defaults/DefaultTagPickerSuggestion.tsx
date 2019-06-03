import * as React from 'react';

import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { classNamesFunction, styled } from 'office-ui-fabric-react/lib/Utilities';
import {
  IDefaultTagPickerSuggestionProps,
  IDefaultTagPickerStyleProps,
  IDefaultTagPickerSuggestionStyles
} from './DefaultTagPickerSuggestion.types';
import { getStyles } from './DefaultTagPickerSuggestion.styles';

const getClassNames = classNamesFunction<IDefaultTagPickerStyleProps, IDefaultTagPickerSuggestionStyles>();

export const DefaultTagPickerSuggestionInner = <TTag extends ITag = ITag>(props: IDefaultTagPickerSuggestionProps<TTag>) => {
  const classNames = getClassNames(props.styles, {
    theme: props.theme!
  });

  return <div className={classNames.suggestionTextOverflow}>{props.item.name}</div>;
};

export const DefaultTagPickerSuggestion = styled<
  IDefaultTagPickerSuggestionProps,
  IDefaultTagPickerStyleProps,
  IDefaultTagPickerSuggestionStyles
>(DefaultTagPickerSuggestionInner, getStyles, undefined, { scope: 'TagItemSuggestion' }) as typeof DefaultTagPickerSuggestionInner;
