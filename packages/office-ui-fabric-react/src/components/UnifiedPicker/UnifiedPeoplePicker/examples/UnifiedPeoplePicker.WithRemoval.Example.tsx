import * as React from 'react';
import { UnifiedPeoplePicker } from '../UnifiedPeoplePicker';
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona/Persona.types';
/* Sample Data */
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from './ExampleSuggestionsModel';
import { Button } from 'office-ui-fabric-react/lib/components/Button';

export class UnifiedPeoplePickerWithRemovalExample extends React.Component<{}, { model: ExampleSuggestionsModel<IPersonaProps> }> {
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
        <Button onClick={this._resetModel} ariaLabel="Reset Data Model">
          Reset Data Model
        </Button>
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
