import * as React from 'react';
import { UnifiedTagPicker } from '../UnifiedTagPicker';
import { ISelectedItemProps } from 'office-ui-fabric-react/lib/SelectedItemsList';
/* Sample Data */
import { ITag } from 'office-ui-fabric-react/lib/Pickers';
import { ISuggestionModel } from 'office-ui-fabric-react/lib/Pickers';
import { tags } from './TagExampleData';
import { ExampleSuggestionsModel } from '../../examples/ExampleSuggestionsModel';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button/index';
import * as ExampleStyles from './Example.scss';

/**
 * Our custom tag type
 */
type CustomTagWithEmojiIcon = ITag & {
  emojiIcon: string;
};

// custom example data
const exampleEmoji = ['😊', '🤙', '🤘', '😎', '🐛'];
const customTags: CustomTagWithEmojiIcon[] = tags.map((tag, i) => ({ ...tag, emojiIcon: exampleEmoji[i % exampleEmoji.length] }));

/**
 * Custom component we use to render our suggestion items in the floating picker
 */
const CustomSuggestionItem = (props: ISuggestionModel<CustomTagWithEmojiIcon>): JSX.Element => (
  <div key={props.item.key} className={ExampleStyles.customSuggestionItem}>
    <span className={ExampleStyles.customSuggestionItemEmoji}>{props.item.emojiIcon}</span> {props.item.name}
  </div>
);

/**
 * Custom component we use to render our selected in the suggestion list
 *
 * The specifics of this component aren't that important, but it *is* important that
 * it binc props.onRemoveItem somewhere in its body.
 */
const CustomSelectedItem = (props: ISelectedItemProps<CustomTagWithEmojiIcon>): JSX.Element => (
  <div className={ExampleStyles.customSelectedItem}>
    <i className={ExampleStyles.customSelectedItemEmoji}>{props.item.emojiIcon}</i> {props.name}
    <IconButton iconProps={{ iconName: 'ChromeClose' }} onClick={props.onRemoveItem} />
  </div>
);

export class UnifiedTagPickerWithCustomItemsExample extends React.Component {
  private model = new ExampleSuggestionsModel<CustomTagWithEmojiIcon>(customTags);

  public render() {
    return (
      <UnifiedTagPicker
        onResolveSuggestions={this.model.resolveSuggestions}
        onRenderSuggestionItem={CustomSuggestionItem}
        onRenderSelectedItem={CustomSelectedItem}
      />
    );
  }
}
