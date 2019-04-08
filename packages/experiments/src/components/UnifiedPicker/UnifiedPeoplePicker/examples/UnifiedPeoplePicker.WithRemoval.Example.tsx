import * as React from 'react';
import { UnifiedPeoplePicker } from '../UnifiedPeoplePicker';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
/* Sample Data */
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from './ExampleSuggestionsModel';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

export type ExampleProps = {};
export type ExampleState = { model: ExampleSuggestionsModel<IPersonaProps> };

export class UnifiedPeoplePickerWithRemovalExample extends React.Component<ExampleProps, ExampleState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      model: new ExampleSuggestionsModel<IPersonaProps>(people)
    };
  }

  public render() {
    return (
      <>
        <UnifiedPeoplePicker onResolveSuggestions={this.state.model.resolveSuggestions} onRemoveSuggestion={this._removeItem} />
        <DefaultButton onClick={this._resetModel} ariaLabel="Reset Data Model">
          Reset Data Model
        </DefaultButton>
      </>
    );
  }

  private _removeItem = (item: IPersonaProps) => this.state.model.removeSuggestion(item);
  private _resetModel = () => {
    this.setState({
      model: new ExampleSuggestionsModel<IPersonaProps>(people)
    });
  };
}
