import * as React from 'react';
import { UnifiedPeoplePicker, ComposableSuggestionControl } from 'office-ui-fabric-react/lib/components/UnifiedPicker/UnifiedPeoplePicker';
import { SuggestionsControl, ISuggestionsHeaderFooterProps } from 'office-ui-fabric-react/lib/components/FloatingPicker';
/* Sample Data */
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona/Persona.types';
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from './ExampleSuggestionsModel';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';

export class UnifiedPeoplePickerWithCustomHeaderFooterExample extends React.Component<
  {},
  { isSearching: boolean; isResultEmpty: boolean }
> {
  private model = new ExampleSuggestionsModel<IPersonaProps>(people);
  private _searchIndicatorItem: ISuggestionsHeaderFooterProps = {
    renderItem: () => {
      return (
        <div style={{ display: 'flex', padding: '0.5em', alignItems: 'center' }}>
          <Spinner style={{ paddingRight: '0.5em' }} /> Hold on, we're searching..
        </div>
      );
    },
    shouldShow: () => {
      return this.state.isSearching;
    },
    ariaLabel: "Hold on, we're searching.."
  };
  private _noResultsIndicatorItem: ISuggestionsHeaderFooterProps = {
    renderItem: () => {
      return <div style={{ display: 'flex', padding: '0.5em', alignItems: 'center' }}>No Results 😢</div>;
    },
    shouldShow: () => {
      return this.state.isResultEmpty;
    },
    ariaLabel: 'No Results'
  };

  private _headerItemsProps: ISuggestionsHeaderFooterProps[] = [];
  private _footerItemsProps: ISuggestionsHeaderFooterProps[] = [this._searchIndicatorItem, this._noResultsIndicatorItem];

  constructor(props: {}) {
    super(props);
    this.state = {
      isSearching: false,
      isResultEmpty: false
    };
  }

  public render() {
    return <UnifiedPeoplePicker onResolveSuggestions={this.resolveSuggestions} onRenderSuggestionControl={this.CustomSuggestionControl} />;
  }

  private CustomSuggestionControl: ComposableSuggestionControl<IPersonaProps> = overriddenProps => (
    <SuggestionsControl headerItemsProps={this._headerItemsProps} footerItemsProps={this._footerItemsProps} {...overriddenProps} />
  );

  /**
   * Wrap the example model's suggestion resolve logic to control the internal state of this component.
   */
  private resolveSuggestions = async (filter: string, selectedItems?: IPersonaProps[]): Promise<IPersonaProps[]> => {
    this.setState({
      isSearching: true,
      isResultEmpty: false
    });
    const searchResult = await this.model.resolveSuggestions(filter, selectedItems);
    this.setState({
      isSearching: false,
      isResultEmpty: searchResult.length === 0
    });
    return searchResult;
  };
}
