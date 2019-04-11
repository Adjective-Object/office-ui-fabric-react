import * as React from 'react';

import { classNamesFunction, BaseComponent, css, styled } from 'office-ui-fabric-react/lib/Utilities';
import { IProcessedStyleSet } from 'office-ui-fabric-react/lib/Styling';
import { CommandButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { ISuggestionItemProps, ISuggestionsItemStyleProps, ISuggestionsItemStyles } from './SuggestionsItem.types';
import { PropsOf } from '../../UnifiedPicker/ComposingUnifiedPicker.types';
import { getStyles } from './SuggestionsItem.styles';

const getClassNames = classNamesFunction<ISuggestionsItemStyleProps, ISuggestionsItemStyles>();

const SuggestionsItemInner = React.memo(function<T>(props: ISuggestionItemProps<T>) {
  const {
    suggestionModel,
    onRenderSuggestion: RenderSuggestion,
    onClick,
    className,
    onRemoveItem,
    isSelectedOverride,
    removeButtonAriaLabel,
    styles,
    theme
  } = props;

  // TODO
  // Clean this up by leaving only the first part after removing support for SASS.
  // Currently we can not remove the SASS styles from SuggestionsItem class because it
  // might be used by consumers separately from pickers extending from BasePicker
  // and have not used the new 'styles' prop. Because it's expecting a type parameter,
  // we can not use the 'styled' function without adding some helpers which can break
  // downstream consumers who did not use the new helpers.
  // We check for 'styles' prop which is going to be injected by the 'styled' HOC
  // in Suggestions when the typed SuggestionsItem class is ready to be rendered. If the
  // check passes we can use the CSS-in-JS styles. If the check fails (ex: custom picker),
  // then we just use the old SASS styles instead.
  const classNames: Partial<IProcessedStyleSet<ISuggestionsItemStyles>> = styles
    ? getClassNames(styles, {
        theme: theme!,
        className,
        suggested: suggestionModel.selected || isSelectedOverride
      })
    : {
        itemButton: css('ms-Suggestions-itemButton'),
        closeButton: css('ms-Suggestions-closeButton')
      };

  return (
    <div className={classNames.root}>
      <CommandButton onClick={onClick} className={classNames.itemButton}>
        <RenderSuggestion {...props.suggestionModel} />
      </CommandButton>
      {props.showRemoveButton ? (
        <IconButton
          iconProps={{ iconName: 'Cancel', styles: { root: { fontSize: '12px' } } }}
          title={removeButtonAriaLabel}
          ariaLabel={removeButtonAriaLabel}
          onClick={onRemoveItem}
          className={classNames.closeButton}
        />
      ) : null}
    </div>
  );
});

export const SuggestionsItem: React.StatelessComponent<PropsOf<typeof SuggestionsItemInner>> = styled(
  SuggestionsItemInner,
  getStyles,
  undefined,
  {
    scope: 'SuggestionsItem'
  }
);
