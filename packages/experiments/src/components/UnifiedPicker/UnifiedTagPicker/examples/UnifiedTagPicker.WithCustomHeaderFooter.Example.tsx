import * as React from 'react';
import { SuggestionsControl, ISuggestionsHeaderFooterProps } from '../../../FloatingSuggestions';
import { UnifiedTagPicker } from '../UnifiedTagPicker';
/* Sample Data */
import * as ExampleStyles from './Example.scss';
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { tags } from './TagExampleData';
import { ExampleSuggestionsModel } from '../../../SelectedItemsList/SelectedPeopleList/examples/ExampleSuggestionsModel';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { ComposableSuggestionControl } from '../../DefaultUnifiedPickerView/Composing/useDefaultComposedUnifiedPickerView.types';

export type ExampleProps = {};
export type ExampleState = { isSearching: boolean; isResultEmpty: boolean };

export class UnifiedTagPickerWithCustomHeaderFooterExample extends React.Component<ExampleProps, ExampleState> {
  private model = new ExampleSuggestionsModel<ITag>(tags);
  private _searchIndicatorItem: ISuggestionsHeaderFooterProps = {
    renderItem: () => {
      return (
        <div className={ExampleStyles.headerFooterWrapper}>
          <Spinner className={ExampleStyles.headerFooterSpinner} /> Hold on, we're searching..
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
      return <div className={ExampleStyles.headerFooterWrapper}>No Results 😢</div>;
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
    return <UnifiedTagPicker onResolveSuggestions={this.resolveSuggestions} onRenderSuggestionControl={this.CustomSuggestionControl} />;
  }

  private CustomSuggestionControl: ComposableSuggestionControl<ITag> = overriddenProps => (
    <SuggestionsControl headerItemsProps={this._headerItemsProps} footerItemsProps={this._footerItemsProps} {...overriddenProps} />
  );

  /**
   * Wrap the example model's suggestion resolve logic to control the internal state of this component.
   */
  private resolveSuggestions = async (filter: string, selectedItems?: ITag[]): Promise<ITag[]> => {
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
