// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license

// tslint:disable:max-line-length

import { IIconOptions, IIconSubset, registerIcons } from '@uifabric/styling';

export function initializeIcons(baseUrl: string = '', options?: IIconOptions): void {
  const subset: IIconSubset = {
    style: {
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontStyle: 'normal',
      fontWeight: 'normal',
      speak: 'none'
    },
    fontFace: {
      fontFamily: `"FabricMDL2Icons-2"`,
      src: `url('${baseUrl}fabric-icons-2-8820ef0b.woff') format('woff')`
    },
    icons: {
      FontIncrease: '\uE8E8',
      FontSize: '\uE8E9',
      CellPhone: '\uE8EA',
      RepeatOne: '\uE8ED',
      RepeatAll: '\uE8EE',
      Calculator: '\uE8EF',
      Library: '\uE8F1',
      PostUpdate: '\uE8F3',
      NewFolder: '\uE8F4',
      CalendarReply: '\uE8F5',
      UnsyncFolder: '\uE8F6',
      SyncFolder: '\uE8F7',
      BlockContact: '\uE8F8',
      Accept: '\uE8FB',
      BulletedList: '\uE8FD',
      Preview: '\uE8FF',
      News: '\uE900',
      Chat: '\uE901',
      Group: '\uE902',
      World: '\uE909',
      Comment: '\uE90A',
      DockLeft: '\uE90C',
      DockRight: '\uE90D',
      Repair: '\uE90F',
      Accounts: '\uE910',
      Street: '\uE913',
      RadioBullet: '\uE915',
      Stopwatch: '\uE916',
      Clock: '\uE917',
      WorldClock: '\uE918',
      AlarmClock: '\uE919',
      Photo: '\uE91B',
      ActionCenter: '\uE91C',
      Hospital: '\uE91D',
      Timer: '\uE91E',
      FullCircleMask: '\uE91F',
      LocationFill: '\uE920',
      ChromeMinimize: '\uE921',
      ChromeRestore: '\uE923',
      Annotation: '\uE924',
      Fingerprint: '\uE928',
      Handwriting: '\uE929',
      ChromeFullScreen: '\uE92D',
      Completed: '\uE930',
      Label: '\uE932',
      FlickDown: '\uE935',
      FlickUp: '\uE936',
      FlickLeft: '\uE937',
      FlickRight: '\uE938',
      MiniExpand: '\uE93A',
      MiniContract: '\uE93B',
      Streaming: '\uE93E',
      MusicInCollection: '\uE940',
      OneDriveLogo: '\uE941',
      CompassNW: '\uE942',
      Code: '\uE943',
      LightningBolt: '\uE945',
      CalculatorMultiply: '\uE947',
      CalculatorAddition: '\uE948',
      CalculatorSubtract: '\uE949',
      CalculatorPercentage: '\uE94C',
      CalculatorEqualTo: '\uE94E',
      PrintfaxPrinterFile: '\uE956',
      StorageOptical: '\uE958',
      Communications: '\uE95A',
      Headset: '\uE95B',
      Health: '\uE95E',
      FrontCamera: '\uE96B',
      ChevronUpSmall: '\uE96D',
      ChevronDownSmall: '\uE96E',
      ChevronLeftSmall: '\uE96F',
      ChevronRightSmall: '\uE970',
      ChevronUpMed: '\uE971',
      ChevronDownMed: '\uE972',
      ChevronLeftMed: '\uE973',
      ChevronRightMed: '\uE974',
      Devices2: '\uE975',
      PC1: '\uE977',
      PresenceChickletVideo: '\uE979',
      Reply: '\uE97A',
      HalfAlpha: '\uE97E',
      ConstructionCone: '\uE98F',
      DoubleChevronLeftMed: '\uE991',
      Volume0: '\uE992',
      Volume1: '\uE993',
      Volume2: '\uE994',
      Volume3: '\uE995',
      Chart: '\uE999',
      Robot: '\uE99A',
      Manufacturing: '\uE99C',
      LockSolid: '\uE9A2',
      FitPage: '\uE9A6',
      FitWidth: '\uE9A7',
      BidiLtr: '\uE9AA',
      BidiRtl: '\uE9AB',
      RightDoubleQuote: '\uE9B1',
      Sunny: '\uE9BD',
      CloudWeather: '\uE9BE',
      Cloudy: '\uE9BF',
      PartlyCloudyDay: '\uE9C0'
    }
  };

  registerIcons(subset, options);
}
