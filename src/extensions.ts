import type { Extension, ExtensionConfig } from './extension';

type Boxed<T> = T extends string
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    String
  : T extends boolean
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    Boolean
  : T extends number
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    Number
  : T extends symbol
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    Symbol
  : T extends bigint
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    BigInt
  : T;

type Extend<
  T,
  TConfigs extends readonly ExtensionConfig[],
  TRawConfigs extends readonly ExtensionConfig[] = TConfigs,
> = TConfigs extends readonly [infer TConfig, ...infer TRest]
  ? TConfig extends ExtensionConfig<infer U, infer TExtensions>
    ? T extends U
      ? Boxed<T> & {
          [P in keyof ReturnType<TExtensions>]: (
            ...args: Parameters<ReturnType<TExtensions>[P]>
          ) => Extend<ReturnType<ReturnType<TExtensions>[P]>, TRawConfigs>;
        }
      : TRest extends ExtensionConfig[]
      ? Extend<T, TRest, TRawConfigs>
      : never
    : never
  : T;

type Ex<
  TConfigs extends readonly ExtensionConfig[],
  TRawConfigs extends readonly ExtensionConfig[] = TConfigs,
> = TConfigs extends readonly [infer TConfig, ...infer TRest]
  ? TConfig extends ExtensionConfig<infer T>
    ? TRest extends ExtensionConfig[]
      ? (<U extends T>(extensible: U) => Extend<U, TRawConfigs>) &
          Ex<TRest, TRawConfigs>
      : never
    : never
  : unknown;

const extend = (extensible: unknown, configs: readonly ExtensionConfig[]) => {
  for (const { extensions, type } of configs) {
    const { problems } = type(extensible);
    if (problems === undefined) {
      const rawMixins = extensions(extensible) as Record<
        string | number | symbol,
        Extension
      >;
      const mixins = Object.entries(rawMixins).reduce((acc, [key, rawFn]) => {
        const fn = (...args: unknown[]) => {
          const result = rawFn(...args);
          return extend(result, configs);
        };
        acc[key] = fn;
        return acc;
      }, {} as Record<string | number | symbol, unknown>);
      return Object.assign(extensible as object, mixins);
    }
  }
  return extensible;
};

export const extensions = {
  use: <TConfigs extends readonly ExtensionConfig[]>(
    ...configs: TConfigs
  ): Ex<TConfigs> =>
    ((extensible: unknown) => extend(extensible, configs)) as Ex<TConfigs>,
};
