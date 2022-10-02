/**
 * Gets all elements except for head in an array
 * @example
 * Tail<[1, 2, 3]>; // [2, 3]
 */
type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest]
  ? Rest
  : never;

/**
 * Returns Tail<T> if first element of T matches P. Somehow resolves issues with
 * union types, but unsure how; @see {@link https://stackoverflow.com/a/57837897/1105281}
 */
type TailUnion<P, T extends unknown[]> = T extends unknown[]
  ? T[0] extends P
    ? Tail<T>
    : never
  : never;

/**
 * Converts a string like "a.b.c" to an array ["a", "b", "c"]
 */
type PathToStringArray<T extends string> =
  T extends `${infer Head}.${infer Tails}`
    ? [...PathToStringArray<Head>, ...PathToStringArray<Tails>]
    : [T];

type OmitKeysDeepArr<
  Obj,
  PathsToOmit extends string[]
  // eslint-disable-next-line @typescript-eslint/ban-types
> = Obj extends object
  ? PathsToOmit[1] extends string
    ? Omit<Obj, Extract<keyof Obj, PathsToOmit[0]>> &
        Partial<{
          [K in Extract<keyof Obj, PathsToOmit[0]>]: NonNullable<
            OmitKeysDeepArr<Obj[K], TailUnion<K, PathsToOmit>>
          >;
        }>
    : Omit<Obj, Extract<keyof Obj, PathsToOmit[0]>>
  : Obj;

/**
 * For any object, enforces that the keys provided are completely omitted; works with
 * deeply nested syntax, by using period (`.`) as a delimiter.
 *
 * @example
 * type Foo = { a: 2, b: { c: 3, d: 4 } }
 * type A = OmitKeysDeep<Foo, "a">; // {b: { c: 3, d: 4 } }
 * type B = OmitKeysDeep<Foo, "b">; // {a: 2 }
 * type BC = OmitKeysDeep<Foo, "b.c">; // {a: 2, b: { d: 4 } }
 * type ABC = OmitKeysDeep<Foo, "a" | "b.c">; // {b: { d: 4 } }
 */
export type OmitKeysDeep<T, P extends string> = OmitKeysDeepArr<
  T,
  PathToStringArray<P>
>;
