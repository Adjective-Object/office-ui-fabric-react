import * as React from 'react';
import { KeyCodes, createArray, getRTLSafeKeyCode } from 'office-ui-fabric-react/lib/Utilities';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { DetailsRow, IColumn, Selection, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';

const ITEMS = createArray(10, index => ({
  key: index.toString(),
  name: 'Item-' + index,
  url: 'http://placehold.it/100x' + (200 + index!)
}));

const COLUMNS: IColumn[] = [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    minWidth: 100
  },
  {
    key: 'link',
    name: 'Link',
    fieldName: 'url',
    minWidth: 100,
    onRender: item => <Link href={item.url}>{item.url}</Link>
  },
  {
    key: 'link',
    name: 'Link',
    fieldName: 'url',
    minWidth: 100,
    onRender: item => <DefaultButton>{item.url}</DefaultButton>
  }
];

export class FocusZoneListExample extends React.PureComponent {
  private _selection: Selection;

  constructor(props: {}) {
    super(props);

    this._selection = new Selection();
    this._selection.setItems(ITEMS);
  }

  public render(): JSX.Element {
    return (
      <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true} isInnerZoneKeystroke={this._isInnerZoneKeystroke}>
        {ITEMS.map((item, index) => (
          <DetailsRow
            key={item.name}
            item={item}
            itemIndex={index}
            columns={COLUMNS}
            selectionMode={SelectionMode.none}
            selection={this._selection}
            styles={{ root: { display: 'block', width: '100%' } }}
          />
        ))}
      </FocusZone>
    );
  }

  private _isInnerZoneKeystroke = (ev: React.KeyboardEvent<HTMLElement>): boolean => {
    return ev.which === getRTLSafeKeyCode(KeyCodes.right);
  };
}
