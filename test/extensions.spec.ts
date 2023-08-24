import { type } from 'arktype';
import { describe, expect, it } from 'vitest';

import { extension, extensions } from '../src';

describe('extensions', () => {
  it('should create an extension', () => {
    const stringExtensions = extension('string', (s) => ({
      emphasize: (level: number) => s + '!'.repeat(level),
      upper: () => s.toUpperCase(),
    }));

    expect(stringExtensions).toBeDefined();
  });

  it('should extend a primitive type', () => {
    const stringExtensions = extension('string', (s) => ({
      emphasize: (level: number) => s + '!'.repeat(level),
      upper: () => s.toUpperCase(),
    }));
    const ex = extensions.use(stringExtensions);

    expect(ex('hello').emphasize(3).toString()).toBe('hello!!!');
    expect(ex('hello').upper().toString()).toBe('HELLO');
  });

  it('should be able to chain extensions', () => {
    const stringExtensions = extension('string', (s) => ({
      emphasize: (level: number) => s + '!'.repeat(level),
      upper: () => s.toUpperCase(),
      finalIndex: () => s.length - 1,
    }));
    const ex = extensions.use(stringExtensions);

    expect(ex('hello').emphasize(3).upper().toString()).toBe('HELLO!!!');
    expect(ex('hello').emphasize(3).upper().finalIndex()).toBe(7);
  });

  it('should be extend an object type', () => {
    const intervalSchema = type({
      start: 'Date | number',
      end: 'Date | number',
    });
    const intervalExtensions = extension(intervalSchema, (i) => ({
      duration: () =>
        (i.end instanceof Date ? i.end.getTime() : i.end) -
        (i.start instanceof Date ? i.start.getTime() : i.start),
    }));
    const ex = extensions.use(intervalExtensions);

    const interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
    };
    expect(ex(interval).duration()).toBe(86400000);
  });

  it('should be able to choose the proper extension to use', () => {
    const numberExtensions = extension('number', (n) => ({
      double: () => n * 2,
    }));
    const stringExtensions = extension('string', (s) => ({
      emphasize: (level: number) => s + '!'.repeat(level),
      upper: () => s.toUpperCase(),
    }));
    const intervalSchema = type({
      start: 'Date | number',
      end: 'Date | number',
    });
    const intervalExtensions = extension(intervalSchema, (i) => ({
      duration: () =>
        (i.end instanceof Date ? i.end.getTime() : i.end) -
        (i.start instanceof Date ? i.start.getTime() : i.start),
    }));
    const ex = extensions.use(
      numberExtensions,
      stringExtensions,
      intervalExtensions,
    );

    const interval = {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
    };
    expect(ex(interval).duration().double().valueOf()).toBe(86400000 * 2);
    expect(ex('hello').emphasize(3).toString()).toBe('hello!!!');
  });
});
