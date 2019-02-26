import * as React from 'react';
import { mount } from 'enzyme';
import { UnifiedPickerState } from './UnifiedPicker.state';

const testView = () => {
  return <div />;
};

// States do not generate rendered output so unit tests test that state initializes and reacts
// to inputs and events as expected.
describe('UnifiedPickerState', () => {
  it('initializes default state correctly', () => {

    const testUnifiedPickerState = mount(<UnifiedPickerState renderView={testView} />);

    expect(testUnifiedPickerState.state('text')).toBe('Default Text');
    expect(testUnifiedPickerState.state('status')).toBe('State Text');
  });

  it('uses props to initialize state correctly', () => {
    const defaultText = 'Prop Default Text';
    const testUnifiedPickerState = mount(<UnifiedPickerState defaultText={defaultText} renderView={testView} />);

    expect(testUnifiedPickerState.state('text')).toBe(defaultText);
  });
});
