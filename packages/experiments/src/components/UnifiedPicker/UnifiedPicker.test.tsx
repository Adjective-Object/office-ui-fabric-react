import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { UnifiedPicker } from './UnifiedPicker';

describe('UnifiedPicker', () => {
  it('renders correctly with no props', () => {
    const tree = renderer.create(<UnifiedPicker />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders text prop correctly', () => {
    const tree = renderer.create(<UnifiedPicker text="textProp" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
