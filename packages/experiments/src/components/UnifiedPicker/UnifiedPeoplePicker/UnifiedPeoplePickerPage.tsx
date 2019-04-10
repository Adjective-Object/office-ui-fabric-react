import * as React from 'react';
import { ExampleCard, IComponentDemoPageProps, ComponentPage, PropertiesTableSet } from '@uifabric/example-app-base';

import { UnifiedPeoplePickerBasicExample } from './examples/UnifiedPeoplePicker.Basic.Example';
const UnifiedPeoplePickerBasicExampleCode = require('!raw-loader!./examples/UnifiedPeoplePicker.Basic.Example') as string;

import { UnifiedPeoplePickerWithRemovalExample } from './examples/UnifiedPeoplePicker.WithRemoval.Example';
const UnifiedPeoplePickerWithRemovalExampleCode = require('!raw-loader!./examples/UnifiedPeoplePicker.WithRemoval.Example') as string;

import { UnifiedPeoplePickerWithCustomHeaderFooterExample } from './examples/UnifiedPeoplePicker.WithCustomHeaderFooter.Example';
const UnifiedPeoplePickerWithCustomHeaderFooterExampleCode = require('!raw-loader!./examples/UnifiedPeoplePicker.WithCustomHeaderFooter.Example') as string;

import { UnifiedPeoplePickerWithCustomItemsExample } from './examples/UnifiedPeoplePicker.WithCustomItems.Example';
const UnifiedPeoplePickerWithCustomItemsExampleCode = require('!raw-loader!./examples/UnifiedPeoplePicker.WithCustomItems.Example') as string;

import { ClassicNormalPeoplePickerExample } from './examples/ClassicNormalPeoplePicker.Example';
const ClassicNormalPeoplePickerExampleCode = require('!raw-loader!./examples/ClassicNormalPeoplePicker.Example') as string;

import { ClassicCompactPeoplePickerExample } from './examples/ClassicCompactPeoplePicker.Example';
const ClassicCompactPeoplePickerExampleCode = require('!raw-loader!./examples/ClassicCompactPeoplePicker.Example') as string;

export class UnifiedPeoplePickerPage extends React.Component<IComponentDemoPageProps, {}> {
  public render(): JSX.Element {
    return (
      <ComponentPage
        title="UnifiedPeoplePicker"
        componentName="UnifiedPeoplePicker"
        exampleCards={
          <div>
            <ExampleCard title="Basic" isOptIn={true} code={UnifiedPeoplePickerBasicExampleCode}>
              <UnifiedPeoplePickerBasicExample />
            </ExampleCard>
            <ExampleCard title="With Removal" isOptIn={true} code={UnifiedPeoplePickerWithRemovalExampleCode}>
              <UnifiedPeoplePickerWithRemovalExample />
            </ExampleCard>
            <ExampleCard title="With Custom Header / Footer" isOptIn={true} code={UnifiedPeoplePickerWithCustomHeaderFooterExampleCode}>
              <UnifiedPeoplePickerWithCustomHeaderFooterExample />
            </ExampleCard>
            <ExampleCard
              title="With Custom Data Type, Selected Item, and Suggestion Item"
              isOptIn={true}
              code={UnifiedPeoplePickerWithCustomItemsExampleCode}
            >
              <UnifiedPeoplePickerWithCustomItemsExample />
            </ExampleCard>
            <ExampleCard title="Classic Normal Picker" isOptIn={true} code={ClassicNormalPeoplePickerExampleCode}>
              <ClassicNormalPeoplePickerExample />
            </ExampleCard>
            <ExampleCard title="Classic Compact Picker" isOptIn={true} code={ClassicCompactPeoplePickerExampleCode}>
              <ClassicCompactPeoplePickerExample />
            </ExampleCard>
          </div>
        }
        propertiesTables={
          <PropertiesTableSet sources={[require<string>('!raw-loader!@uifabric/experiments/src/components/Tile/Tile.types.ts')]} />
        }
        overview={<div />}
        bestPractices={<div />}
        dos={
          <div>
            <ul>
              <li>Use them to pick people from a list.</li>
            </ul>
          </div>
        }
        donts={
          <div>
            <ul>
              <li>Use them to pick things that aren't people</li>
            </ul>
          </div>
        }
        isHeaderVisible={this.props.isHeaderVisible}
      />
    );
  }
}
