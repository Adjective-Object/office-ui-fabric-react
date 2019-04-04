import * as React from 'react';
import { CompactPeoplePicker } from '../ClassicPeoplePickers';
/* Sample Data */
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona/Persona.types';
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from './ExampleSuggestionsModel';

export class ClassicCompactPeoplePickerExample extends React.Component {
  private model = new ExampleSuggestionsModel<IPersonaProps>(people);

  public render() {
    return <CompactPeoplePicker onResolveSuggestions={this.model.resolveSuggestions} />;
  }
}
