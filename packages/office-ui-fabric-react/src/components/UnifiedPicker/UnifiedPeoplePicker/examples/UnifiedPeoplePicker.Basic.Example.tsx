import * as React from 'react';
import { UnifiedPeoplePicker } from '../UnifiedPeoplePicker';
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona';
import { people } from './PeopleExampleData';

class ExampleSuggestionsModel {
  private peopleList = [...people];

  public resolveSuggestions = (filterText: string, currentPersonas: IPersonaProps[]): Promise<IPersonaProps[]> | null => {
    let filteredPersonas: IPersonaProps[] = [];
    if (filterText) {
      filteredPersonas = this._filterPersonasByText(filterText);
      filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
    }

    return this._convertResultsToPromise(filteredPersonas);
  };

  private _filterPersonasByText(filterText: string): IPersonaProps[] {
    return this.peopleList.filter((item: IPersonaProps) => this._doesTextStartWith(item.text as string, filterText));
  }

  private _doesTextStartWith(text: string, filterText: string): boolean {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]): IPersonaProps[] {
    return personas.filter((persona: IPersonaProps) => !this._listContainsPersona(persona, possibleDupes));
  }

  private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]): boolean {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter((item: IPersonaProps) => item.text === persona.text).length > 0;
  }

  private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
    return new Promise<IPersonaProps[]>(resolve => setTimeout(() => resolve(results), 150));
  }
}

export class UnifiedPeoplePickerBasicExample extends React.Component<{}> {
  private model = new ExampleSuggestionsModel();

  public render() {
    return <UnifiedPeoplePicker onResolveSuggestions={this.model.resolveSuggestions} />;
  }
}
