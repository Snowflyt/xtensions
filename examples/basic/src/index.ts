import { extensions } from 'xtensions';

import {
  dateExtensions,
  numberExtensions,
  stringExtensions,
} from './extensions';

// Create `ex` just after your imports to make extensions more explicit
const ex = extensions.use(dateExtensions, numberExtensions, stringExtensions);

// Extension for Date
const date = new Date();
console.log(ex(date).format('yyyy-MM-dd hh:mm:ss').emphasize().toString());

// Extension for number
console.log(ex(42).add(8).double().valueOf()); // 100

// Extension for string
const s = /* GraphQL */ `
  query todos {
    todos {
      id
      title
      completed
    }
  }
`;
console.log(ex(s).trimIndent().toString());
