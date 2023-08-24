# Xtensions

Bring extensions to TypeScript.

## Installation

### npm

```bash
npm install xtensions
```

### yarn

```bash
yarn add xtensions
```

### pnpm

```bash
pnpm add xtensions
```

## Usage

Let's use a minimal example to show how to use Xtensions.

```ts
import { extension, extensions } from 'xtensions';

// Define extension for string
const stringExtensions = extension('string', (s) => ({ // `s` is inferred to be string
  emphasize: (level: number) => s + '!'.repeat(level),
}));
// Define extension for number
const numberExtensions = extension('number', (n) => ({ // `n` is inferred to be number
  add: (x: number) => n + x,
  double: () => n * 2,
}));
// Define extension for more complex objects
const intervalExtensions = extension({
  start: 'Date | number',
  end: 'Date | number',
}, (i) => ({ // `i` is inferred to be { start: Date | number, end: Date | number }
  duration: () => {
    const start = typeof i.start === 'number' ? i.start : i.start.getTime();
    const end = typeof i.end === 'number' ? i.end : i.end.getTime();
    return end - start;
  },
}));

// Create the extension function (which is usually named `ex`)
const ex = extensions.use(stringExtensions, numberExtensions, intervalExtensions);

// `ex` would choose the correct extension based on the type of the argument
const interval = { start: new Date('2023-01-01'), end: new Date('2023-01-02') };
const duration = ex(interval).duration(); // 86400000
// Note that when use `ex` on primitive types, they would be converted to boxed types.
// For example, string -> String, number -> Number, boolean -> Boolean, etc.
// But don't worry, as TypeScript would infer the type correctly, so you won't forget to use `toString()` or `valueOf()`
// to convert them back to primitive types.
const emphasized = ex('Hello').emphasize(3).toString(); // 'Hello!!!'
const doubled42 = ex(42).double().valueOf(); // 84
// Once you use `ex` on something, it would extend all returned values of extension functions automatically
// for chaining them.
const doubledDuration = ex(interval).duration().double(); // No need to use `ex(ex(interval).duration()).double()`
```

Xtensions uses [ArkType](https://arktype.io/), a truly powerful and natural validator for TypeScript, to infer the type according to definition (like `'string'` -> `string`, `{ start: 'Date | number', end: 'Date | number' }` -> `{ start: Date | number; end: Date | number }`), and validate the types of input (i.e. choose the correct extension to use). You can visit [its website](https://arktype.io/) to learn more how to define more complex types for your extensions.

You can view the recommended way to use Xtensions in a real project in the `examples/` directory. It is recommended to start from `examples/basic`.
