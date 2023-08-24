import { extension } from 'xtensions';

const numberExtensions = extension('number', (n) => ({
  double: () => n * 2,

  add: (x: number) => n + x,
}));

export default numberExtensions;
