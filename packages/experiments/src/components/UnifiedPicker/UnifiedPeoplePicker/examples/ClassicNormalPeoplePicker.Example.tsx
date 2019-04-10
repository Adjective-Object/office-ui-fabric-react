import * as React from 'react';
import { NormalPeoplePicker } from '../ClassicPeoplePickers';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
/* Sample Data */
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona/Persona.types';
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from '../../examples/ExampleSuggestionsModel';

export class ClassicNormalPeoplePickerExample extends React.Component<{}, { isDisabled: boolean }> {
  private model = new ExampleSuggestionsModel<IPersonaProps>(people);

  constructor(props: {}) {
    super(props);
    this.state = { isDisabled: false };
  }

  public render() {
    return (
      <>
        <NormalPeoplePicker
          onResolveSuggestions={this.model.resolveSuggestions}
          suggestionsHeaderText="Suggested People"
          noResultsFooterText="No results found"
          disabled={this.state.isDisabled}
          isQueryForceResolveable={this.isQueryForceResolveable}
        />
        <Checkbox
          styles={{ root: { marginTop: 10 } }}
          label="Disable People Picker"
          checked={this.state.isDisabled}
          onChange={this.onChange}
        />
      </>
    );
  }

  private isQueryForceResolveable = () => true;
  private onChange = (_: any, isDisabled: boolean) => this.setState({ isDisabled: isDisabled! });
}
