import * as React from 'react';
import { UnifiedPeoplePickerBasicExample } from './examples/UnifiedPeoplePicker.Basic.Example';

import { IDocPageProps } from '../../../common/DocPage.types';

const UnifiedPeoplePickerBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/examples/UnifiedPeoplePicker.Basic.Example.tsx') as string;

export const UnifiedPeoplePickerPageProps: IDocPageProps = {
  title: 'UnifiedPeoplePicker',
  componentName: 'UnifiedPeoplePicker',
  componentUrl:
    'https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react/src/components/UnifiedPeoplePicker',
  examples: [
    {
      title: 'Unified People Picker (Basic)',
      code: UnifiedPeoplePickerBasicExampleCode,
      view: <UnifiedPeoplePickerBasicExample />
    }
  ],
  propertiesTablesSources: [require<string>('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/BaseUnifiedPicker.types.ts')],
  overview: require<string>('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/docs/UnifiedPeoplePickerOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/docs/UnifiedPeoplePickerBestPractices.md'),
  dos: require<string>('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/docs/UnifiedPeoplePickerDos.md'),
  donts: require<string>('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/docs/UnifiedPeoplePickerDonts.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true
};
