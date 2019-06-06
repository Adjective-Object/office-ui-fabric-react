import * as React from 'react';
import { IProcessedStyleSet, IStyleSet } from '../../../styling/lib';
import { IStyleFunctionOrObject, Customizations, ICustomizableProps, CustomizerContext, classNamesFunction } from '../../../utilities/lib';
import { IConcatenatedStyleSet, concatStyleSets } from '../../../merge-styles/lib';

/**
 * Copied from uifabric/styles
 */
function _resolve<TStyleProps, TStyleSet extends IStyleSet<TStyleSet>>(
  styleProps: TStyleProps,
  ...allStyles: (IStyleFunctionOrObject<TStyleProps, TStyleSet> | undefined)[]
): IConcatenatedStyleSet<TStyleSet> | undefined {
  const result: Partial<TStyleSet>[] = [];

  for (const styles of allStyles) {
    if (styles) {
      result.push(typeof styles === 'function' ? styles(styleProps) : styles);
    }
  }
  if (result.length === 1) {
    return result[0] as IConcatenatedStyleSet<TStyleSet>;
  } else if (result.length) {
    // cliffkoh: I cannot figure out how to avoid the cast to any here.
    // It is something to do with the use of Omit in IStyleSet.
    // It might not be necessary once  Omit becomes part of lib.d.ts (when we remove our own Omit and rely on
    // the official version).
    // tslint:disable-next-line:no-any
    return concatStyleSets(...(result as any)) as IConcatenatedStyleSet<TStyleSet>;
  }

  return undefined;
}

const DefaultFields = ['theme', 'styles'];

/**
 * classNamesFunction doesn't accept any args and returns a copy of the same function every time.
 * Just call it once and use it for all hook calls.
 */
const getClassNames: <TStyleProps extends {}, TStyleSet extends IStyleSet<TStyleSet>>(
  getStyles: IStyleFunctionOrObject<TStyleProps, TStyleSet> | undefined,
  styleProps?: TStyleProps
) => IProcessedStyleSet<TStyleSet> = classNamesFunction();

/**
 * Creates a getClassNames function which calls getStyles given the props, and injects them
 * into mergeStyleSets.
 */
export const getClassNamesHook = <TStyleProps, TStyleSet extends IStyleSet<TStyleSet>>(
  baseStyles: IStyleFunctionOrObject<TStyleProps, TStyleSet>,
  customizable?: ICustomizableProps
) => {
  const { scope, fields = DefaultFields } = customizable || { scope: '', fields: undefined };

  return (styleProps: TStyleProps = {} as TStyleProps): IProcessedStyleSet<TStyleSet> => {
    const customizationContext = React.useContext(CustomizerContext);
    const settings = Customizations.getSettings(fields, scope, customizationContext.customizations);
    const { styles: customizedStyles } = settings;

    const stylesCallback: IStyleFunctionOrObject<TStyleProps, TStyleSet> = (callbackStyleProps: TStyleProps): Partial<TStyleSet> => {
      return _resolve(callbackStyleProps, baseStyles, customizedStyles, callbackStyleProps);
    };

    return getClassNames(stylesCallback, styleProps);
  };
};
