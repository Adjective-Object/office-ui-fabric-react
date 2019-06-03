import * as React from 'react';
import { ExampleCard, IComponentDemoPageProps, ComponentPage, PropertiesTableSet } from '@uifabric/example-app-base';

import { UnifiedTagPickerBasicExample } from './examples/UnifiedTagPicker.Basic.Example';
const UnifiedTagPickerBasicExampleCode = require('!raw-loader!./examples/UnifiedTagPicker.Basic.Example') as string;

import { UnifiedTagPickerWithRemovalExample } from './examples/UnifiedTagPicker.WithRemoval.Example';
const UnifiedTagPickerWithRemovalExampleCode = require('!raw-loader!./examples/UnifiedTagPicker.WithRemoval.Example') as string;

import { UnifiedTagPickerWithCustomHeaderFooterExample } from './examples/UnifiedTagPicker.WithCustomHeaderFooter.Example';
const UnifiedTagPickerWithCustomHeaderFooterExampleCode = require('!raw-loader!./examples/UnifiedTagPicker.WithCustomHeaderFooter.Example') as string;

import { UnifiedTagPickerWithCustomItemsExample } from './examples/UnifiedTagPicker.WithCustomItems.Example';
const UnifiedTagPickerWithCustomItemsExampleCode = require('!raw-loader!./examples/UnifiedTagPicker.WithCustomItems.Example') as string;

export class UnifiedTagPickerPage extends React.Component<IComponentDemoPageProps, {}> {
  public render(): JSX.Element {
    return (
      <ComponentPage
        title="UnifiedTagPicker"
        componentName="UnifiedTagPicker"
        exampleCards={
          <div>
            <ExampleCard title="Basic" isOptIn={true} code={UnifiedTagPickerBasicExampleCode}>
              <UnifiedTagPickerBasicExample />
            </ExampleCard>
            <ExampleCard title="With Removal" isOptIn={true} code={UnifiedTagPickerWithRemovalExampleCode}>
              <UnifiedTagPickerWithRemovalExample />
            </ExampleCard>
            <ExampleCard title="With Custom Header / Footer" isOptIn={true} code={UnifiedTagPickerWithCustomHeaderFooterExampleCode}>
              <UnifiedTagPickerWithCustomHeaderFooterExample />
            </ExampleCard>
            <ExampleCard
              title="With Custom Data Type, Selected Item, and Suggestion Item"
              isOptIn={true}
              code={UnifiedTagPickerWithCustomItemsExampleCode}
            >
              <UnifiedTagPickerWithCustomItemsExample />
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
              <li>Use them to pick Tag from a list.</li>
            </ul>
          </div>
        }
        donts={
          <div>
            <ul>
              <li>Use them to pick things that aren't a tag</li>
            </ul>
          </div>
        }
        isHeaderVisible={this.props.isHeaderVisible}
      />
    );
  }
}
