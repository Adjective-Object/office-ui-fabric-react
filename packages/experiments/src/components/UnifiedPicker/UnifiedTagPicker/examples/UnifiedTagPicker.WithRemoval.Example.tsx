import * as React from 'react';
import { UnifiedTagPicker } from '../UnifiedTagPicker';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
/* Sample Data */
import { tags } from './TagExampleData';
import { ExampleSuggestionsModel } from '../../../SelectedItemsList/SelectedPeopleList/examples/ExampleSuggestionsModel';

export type ExampleProps = {};
export type ExampleState = { model: ExampleSuggestionsModel<ITag> };

export class UnifiedTagPickerWithRemovalExample extends React.Component<ExampleProps, ExampleState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      model: new ExampleSuggestionsModel<ITag>(tags)
    };
  }

  public render() {
    return (
      <>
        <UnifiedTagPicker onResolveSuggestions={this.state.model.resolveSuggestions} onRemoveSuggestion={this._removeItem} />
        <DefaultButton onClick={this._resetModel} ariaLabel="Reset Data Model">
          Reset Data Model
        </DefaultButton>
      </>
    );
  }

  private _removeItem = (item: ITag) => this.state.model.removeSuggestion(item);
  private _resetModel = () => {
    this.setState({
      model: new ExampleSuggestionsModel<ITag>(tags)
    });
  };
}
