import { ITag } from 'office-ui-fabric-react/lib/Pickers';

export const tags: (ITag & { key: string | number })[] = [
  {
    name: 'javascript',
    key: 'javascript'
  },
  {
    name: 'typescript',
    key: 'typescript'
  },
  {
    name: 'tooling',
    key: 'tooling'
  },
  {
    name: 'github',
    key: 'github'
  },
  {
    name: 'ruby',
    key: 'ruby'
  },
  {
    name: 'scala',
    key: 'scala'
  },
  {
    name: 'project',
    key: 'project'
  },
  {
    name: 'personal',
    key: 'personal'
  },
  {
    name: 'reading',
    key: 'reading'
  }
];

export const mru: ITag[] = tags.slice(0, 5);

export const groupOne: ITag[] = tags.slice(6, 10);

export const groupTwo: ITag[] = tags.slice(11, 16);
