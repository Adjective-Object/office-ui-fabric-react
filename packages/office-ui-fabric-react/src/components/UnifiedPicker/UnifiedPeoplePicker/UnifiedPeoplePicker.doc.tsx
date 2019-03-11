import * as React from 'react';
import { UnifiedPeoplePickerBasicExample } from './examples/UnifiedPeoplePicker.Basic.Example';
import { UnifiedPeoplePickerWithRemovalExample } from './examples/UnifiedPeoplePicker.WithRemoval.Example';
import { UnifiedPeoplePickerWithCustomHeaderFooterExample } from './examples/UnifiedPeoplePicker.WithCustomHeaderFooter.Example';
import { UnifiedPeoplePickerWithCustomItemsExample } from './examples/UnifiedPeoplePicker.WithCustomItems.Example';

import { IDocPageProps } from '../../../common/DocPage.types';

const UnifiedPeoplePickerBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/examples/UnifiedPeoplePicker.Basic.Example.tsx') as string;
const UnifiedPeoplePickerWithRemovalExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/examples/UnifiedPeoplePicker.WithRemoval.Example.tsx') as string;
const UnifiedPeoplePickerWithCustomHeaderFooterExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/examples/UnifiedPeoplePicker.WithCustomHeaderFooter.Example.tsx') as string;
const UnifiedPeoplePickerWithCustomItemsExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/examples/UnifiedPeoplePicker.WithCustomItems.Example.tsx') as string;

export const UnifiedPeoplePickerPageProps: IDocPageProps = {
  title: 'UnifiedPeoplePicker',
  componentName: 'UnifiedPeoplePicker',
  componentUrl:
    'https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react/src/components/UnifiedPeoplePicker',
  examples: [
    {
      title: 'Basic People Picker',
      code: UnifiedPeoplePickerBasicExampleCode,
      view: <UnifiedPeoplePickerBasicExample />
    },
    {
      title: 'People Picker with Suggestion Removal',
      code: UnifiedPeoplePickerWithRemovalExampleCode,
      view: <UnifiedPeoplePickerWithRemovalExample />
    },
    {
      title: 'People Picker with custom Suggestion Headers and Footers',
      code: UnifiedPeoplePickerWithCustomHeaderFooterExampleCode,
      view: <UnifiedPeoplePickerWithCustomHeaderFooterExample />
    },
    {
      title: 'People Picker with custom PickerItems and SelectionWellItems',
      code: UnifiedPeoplePickerWithCustomItemsExampleCode,
      view: <UnifiedPeoplePickerWithCustomItemsExample />
    }
  ],
  propertiesTablesSources: [
    require<string>('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/UnifiedPeoplePicker.types.ts')
  ],
  overview: require<
    string
  >('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/docs/UnifiedPeoplePickerOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/docs/UnifiedPeoplePickerBestPractices.md'),
  dos: require<
    string
  >('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/docs/UnifiedPeoplePickerDos.md'),
  donts: require<
    string
  >('!raw-loader!office-ui-fabric-react/src/components/UnifiedPicker/UnifiedPeoplePicker/docs/UnifiedPeoplePickerDonts.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true
};
