import * as React from 'react';

import { DemoPage } from '../DemoPage';

import { UnifiedPeoplePickerPageProps } from 'office-ui-fabric-react/lib/components/UnifiedPicker/UnifiedPeoplePicker/UnifiedPeoplePicker.doc';

export const UnifiedPeoplePickerPage = (props: { isHeaderVisible: boolean }) => (
  <DemoPage {...{ ...UnifiedPeoplePickerPageProps, ...props }} />
);
