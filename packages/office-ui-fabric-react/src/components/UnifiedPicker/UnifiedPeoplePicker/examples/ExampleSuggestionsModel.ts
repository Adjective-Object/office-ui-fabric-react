export interface IBaseExampleType {
  text?: string;
}

export class ExampleSuggestionsModel<T extends IBaseExampleType> {
  private suggestionsData: T[];

  public constructor(data: T[]) {
    this.suggestionsData = [...data];
  }

  public resolveSuggestions = (filterText: string, currentPersonas?: T[]): Promise<T[]> => {
    let filteredPersonas: T[] = [];
    if (filterText) {
      filteredPersonas = this._filterPersonasByText(filterText);
      filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas || []);
    }

    return this._convertResultsToPromise(filteredPersonas);
  };

  public removeSuggestion(item: T) {
    const index = this.suggestionsData.indexOf(item);
    console.log('removing', item, 'at', index);
    if (index !== -1) {
      this.suggestionsData.splice(index, 1);
    }
  }

  private _filterPersonasByText(filterText: string): T[] {
    return this.suggestionsData.filter((item: T) => this._doesTextStartWith(item.text as string, filterText));
  }

  private _doesTextStartWith(text: string, filterText: string): boolean {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  private _removeDuplicates(personas: T[], possibleDupes: T[]): T[] {
    return personas.filter((persona: T) => !this._listContainsPersona(persona, possibleDupes));
  }

  private _listContainsPersona(persona: T, personas: T[]): boolean {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter((item: T) => item.text === persona.text).length > 0;
  }

  private _convertResultsToPromise(results: T[]): Promise<T[]> {
    return new Promise<T[]>(resolve => setTimeout(() => resolve(results), 150));
  }
}
