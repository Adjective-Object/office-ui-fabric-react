import * as React from 'react';
import { UnifiedPeoplePicker } from '../UnifiedPeoplePicker';
import { ISelectedItemProps } from 'office-ui-fabric-react/lib/components/SelectedItemsList';
/* Sample Data */
import { IPersonaProps } from 'office-ui-fabric-react/lib/components/Persona/Persona.types';
import { people } from './PeopleExampleData';
import { ExampleSuggestionsModel } from './ExampleSuggestionsModel';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';

/**
 * Our custom persona type
 */
type CustomPersonaWithEmail = IPersonaProps & {
  emailAddress: string;
};

/**
 * Utility for generating test data of our custom persona type
 */
const addEmailToPersona = (originalPersona: IPersonaProps): CustomPersonaWithEmail => ({
  ...originalPersona,
  emailAddress: `${(originalPersona.text || 'email').toLocaleLowerCase().replace(/\s/g, '_')}@contoso.com`
});

/**
 * Custom component we use to render our suggestion items in the floating picker
 */
const CustomSuggestionItem = (props: CustomPersonaWithEmail): JSX.Element => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '0.25em' }}>
    <img src={props.imageUrl} alt={props.imageAlt} style={{ width: 32, height: 32, borderRadius: '50%', paddingRight: '0.25em' }} />
    {props.emailAddress}
  </div>
);

/**
 * Custom component we use to render our selected in the suggestion list
 *
 * The specifics of this component aren't that important, but it *is* important that
 * it binc props.onRemoveItem somewhere in its body.
 */
const CustomSelectedItem = (props: ISelectedItemProps<CustomPersonaWithEmail>): JSX.Element => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 2,
      marginRight: 4,
      height: 36,
      border: '1px solid #AAAAAA',
      borderRadius: 18
    }}
  >
    <img
      src={props.item.imageUrl}
      alt={props.item.imageAlt}
      style={{ width: 32, height: 32, borderRadius: '50%', paddingRight: '0.25em' }}
    />
    {props.item.emailAddress}
    <IconButton iconProps={{ iconName: 'ChromeClose' }} onClick={props.onRemoveItem} />
  </div>
);

export class UnifiedPeoplePickerWithCustomItemsExample extends React.Component {
  private model = new ExampleSuggestionsModel<CustomPersonaWithEmail>(people.map(addEmailToPersona));

  public render() {
    return (
      <UnifiedPeoplePicker
        onResolveSuggestions={this.model.resolveSuggestions}
        onRenderSuggestionItem={CustomSuggestionItem}
        onRenderSelectedItem={CustomSelectedItem}
      />
    );
  }
}
