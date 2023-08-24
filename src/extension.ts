import { type } from 'arktype';

import type { Type } from 'arktype';

type ValidateDefinition<TDef> = Parameters<typeof type<TDef>>[0];

type ParseType<TDef> = ReturnType<typeof type<TDef>> extends Type<infer T>
  ? T
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Extension<TArgs extends any[] = any[]> = (
  ...args: TArgs
) => unknown;

export type ExtensionConfig<
  T = unknown,
  TExtensions extends (
    self: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Record<string | number | symbol, Extension> = any,
> = {
  type: Type<T>;
  extensions: TExtensions;
};

export const extension: <
  TDef,
  T extends ParseType<TDef>,
  TExtensions extends (self: T) => Record<string | number | symbol, Extension>,
>(
  def: ValidateDefinition<TDef>,
  extensions: TExtensions,
) => ExtensionConfig<T, TExtensions> = <
  TDef,
  T extends ParseType<TDef>,
  TExtensions extends (self: T) => Record<string | number | symbol, Extension>,
>(
  def: ValidateDefinition<TDef>,
  extensions: TExtensions,
): ExtensionConfig<T, TExtensions> => ({
  type: type(def) as Type<T>,
  extensions,
});
