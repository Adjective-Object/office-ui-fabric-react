import * as React from 'react';
import { UnifiedTagPicker } from '../UnifiedTagPicker';
/* Sample Data */
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { tags } from './TagExampleData';
import { ExampleSuggestionsModel } from '../../examples/ExampleSuggestionsModel';

export class UnifiedTagPickerBasicExample extends React.Component {
  private model = new ExampleSuggestionsModel<ITag>(tags);

  public render() {
    return <UnifiedTagPicker onResolveSuggestions={this.model.resolveSuggestions} />;
  }
}
