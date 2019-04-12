import * as React from 'react';

import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { people } from '../../../UnifiedPicker/UnifiedPeoplePicker/examples/PeopleExampleData';
import { SelectedPeopleList } from '../SelectedPeopleList';
import { Selection } from 'office-ui-fabric-react/lib/Selection';
import { IPersonaProps } from '../../../../../../office-ui-fabric-react/lib';
import { SelectedPersona } from '../Items/SelectedPersona';
import { EditableItem } from '../../Items/EditableItem';
import { FloatingPeopleSuggestions } from '../../../FloatingSuggestions/FloatingPeopleSuggestions/FloatingPeopleSuggestions';
import { EditingItemFloatingPickerProps } from '../../Items/EditingItem';
import { ExampleSuggestionsModel } from '../../../UnifiedPicker/examples/ExampleSuggestionsModel';
import { SuggestionsStore } from '../../../FloatingSuggestions';
import { TriggerOnContextMenu } from '../../Items/TriggerOnContextMenu';

export interface IPeopleSelectedItemsListExampleState {
  currentSelectedItems: IPersonaProps[];
  controlledComponent: boolean;
}

export class SelectedPeopleListWithEditExample extends React.Component<{}, IPeopleSelectedItemsListExampleState> {
  private _selectionList: SelectedPeopleList;
  private selection: Selection = new Selection({ onSelectionChanged: () => this._onSelectionChange() });

  // Used to resolve suggestions on the editableItem
  private model = new ExampleSuggestionsModel<IPersonaProps>(people);
  private suggestionsStore = new SuggestionsStore<IPersonaProps>();

  /**
   * Build a custom selected item capable of being edited when the item is right clicked
   */
  private SelectedItem = EditableItem({
    itemComponent: TriggerOnContextMenu(SelectedPersona),
    getEditingItemText: persona => persona.text || '',
    onRenderFloatingPicker: (props: EditingItemFloatingPickerProps<IPersonaProps>) => (
      <FloatingPeopleSuggestions {...props} suggestionsStore={this.suggestionsStore} onResolveSuggestions={this.model.resolveSuggestions} />
    )
  });

  public render(): JSX.Element {
    return (
      <div className={'ms-BasePicker-text'}>
        Right click any persona to edit it
        <br />
        <PrimaryButton text="Add another item" onClick={this._onAddItemButtonClicked} />
        {this._renderExtendedPicker()}
      </div>
    );
  }

  private _renderExtendedPicker(): JSX.Element {
    return (
      <div>
        <SelectedPeopleList
          key={'normal'}
          removeButtonAriaLabel={'Remove'}
          defaultSelectedItems={[people[40]]}
          componentRef={this._setComponentRef}
          selection={this.selection}
          onRenderItem={this.SelectedItem}
        />
      </div>
    );
  }

  private _setComponentRef = (component: SelectedPeopleList): void => {
    this._selectionList = component;
  };

  private _onAddItemButtonClicked = (): void => {
    const randomPerson = people[Math.floor(Math.random() * (people.length - 1))];
    this._selectionList.addItems([randomPerson]);
  };

  private _onSelectionChange(): void {
    this.forceUpdate();
  }
}
