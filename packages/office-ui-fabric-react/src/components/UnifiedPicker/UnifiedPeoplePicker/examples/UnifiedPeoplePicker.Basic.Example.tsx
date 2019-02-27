import * as React from 'react';
import { UnifiedPeoplePicker } from '../UnifiedPeoplePicker';
/* Sample Data */
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona/Persona.types';
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from './ExampleSuggestionsModel';

export class UnifiedPeoplePickerBasicExample extends React.Component<{}> {
  private model = new ExampleSuggestionsModel<IPersonaProps>(people);

  public render() {
    return <UnifiedPeoplePicker onResolveSuggestions={this.model.resolveSuggestions} />;
  }
}
