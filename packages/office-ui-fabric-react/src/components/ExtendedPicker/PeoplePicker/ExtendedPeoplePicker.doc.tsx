import * as React from 'react';
import { ExtendedPeoplePickerBasicExample } from '../examples/ExtendedPeoplePicker.Basic.Example';
import { ExtendedPeoplePickerAdvancedExample } from '../examples/ExtendedPeoplePicker.Advanced.Example';

import { IDocPageProps } from '../../../common/DocPage.types';

const ExtendedPeoplePickerBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/ExtendedPicker/examples/ExtendedPeoplePicker.Basic.Example.tsx') as string;
const ExtendedPeoplePickerAdvancedExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/ExtendedPicker/examples/ExtendedPeoplePicker.Advanced.Example.tsx') as string;

export const ExtendedPeoplePickerPageProps: IDocPageProps = {
  title: 'ExtendedPeoplePicker',
  componentName: 'ExtendedPeoplePicker',
  componentUrl:
    'https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react/src/components/ExtendedPeoplePicker',
  examples: [
    {
      title: 'Extended People Picker (Basic)',
      code: ExtendedPeoplePickerBasicExampleCode,
      view: <ExtendedPeoplePickerBasicExample />
    },
    {
      title: 'Extended People Picker Advanced',
      code: ExtendedPeoplePickerAdvancedExampleCode,
      view: <ExtendedPeoplePickerAdvancedExample />
    }
  ],
  propertiesTablesSources: [
    require<string>('!raw-loader!office-ui-fabric-react/src/components/ExtendedPicker/BaseExtendedPicker.types.ts')
  ],
  overview: require<string>('!raw-loader!office-ui-fabric-react/src/components/ExtendedPicker/docs/ExtendedPeoplePickerOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!office-ui-fabric-react/src/components/ExtendedPicker/docs/ExtendedPeoplePickerBestPractices.md'),
  dos: require<string>('!raw-loader!office-ui-fabric-react/src/components/ExtendedPicker/docs/ExtendedPeoplePickerDos.md'),
  donts: require<string>('!raw-loader!office-ui-fabric-react/src/components/ExtendedPicker/docs/ExtendedPeoplePickerDonts.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true
};
