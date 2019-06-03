import * as React from 'react';

import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { styled, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import { IDefaultTagItemProps, IDefaultTagItemStyleProps, ITagItemStyles } from './DefaultTagItem.types';
import { getStyles } from './DefaultTagItem.styles';

const getClassNames = classNamesFunction<IDefaultTagItemStyleProps, ITagItemStyles>();

export const DefaultTagItemInner = <TTag extends ITag = ITag>(props: IDefaultTagItemProps<TTag>) => {
  const {
    theme,
    styles,
    selected,
    disabled,
    enableTagFocusInDisabledPicker,
    className,
    index,
    onRemoveItem,
    removeButtonAriaLabel
  } = props;

  const classNames = getClassNames(styles, {
    theme: theme!,
    className,
    selected,
    disabled
  });

  return (
    <div
      className={classNames.root}
      role={'listitem'}
      key={index}
      data-selection-index={index}
      data-is-focusable={(enableTagFocusInDisabledPicker || !disabled) && true}
    >
      <span className={classNames.text} aria-label={props.item.name}>
        {props.item.name}
      </span>
      <IconButton
        styles={classNames.subComponentStyles.closeButtonStyles()}
        onClick={onRemoveItem}
        disabled={disabled}
        iconProps={{ iconName: 'Cancel', styles: { root: { fontSize: '12px' } } }}
        ariaLabel={removeButtonAriaLabel}
      />
    </div>
  );
};

export const DefaultTagItem = styled<IDefaultTagItemProps, IDefaultTagItemStyleProps, ITagItemStyles>(
  DefaultTagItemInner,
  getStyles,
  undefined,
  {
    scope: 'DefaultTagItem'
  }
) as typeof DefaultTagItemInner;

export type DefaultTagItem = React.ComponentType<IDefaultTagItemProps>;
