import * as React from 'react';
import { NormalPeoplePicker } from '../ClassicPeoplePickers';
/* Sample Data */
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona/Persona.types';
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from './ExampleSuggestionsModel';

export class ClassicNormalPeoplePickerBasicExample extends React.Component {
  private model = new ExampleSuggestionsModel<IPersonaProps>(people);

  public render() {
    return <NormalPeoplePicker onResolveSuggestions={this.model.resolveSuggestions} />;
  }
}
