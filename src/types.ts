export type ExtractKey<
  T,
  K extends string | number | symbol
> = K extends keyof T ? T[K] : never;

export type ExtractResponses<T> = ExtractKey<T, 'responses'>;
export type ExtractSchema<T> = ExtractKey<T, 'schema'>;

export type ExtractSuccessfulHTTPResponse<T> =
  | ExtractKey<T, 200>
  | ExtractKey<T, 201>
  | ExtractKey<T, 202>
  | ExtractKey<T, 203>
  | ExtractKey<T, 204>
  | ExtractKey<T, 205>
  | ExtractKey<T, 206>
  | ExtractKey<T, 207>
  | ExtractKey<T, 208>
  | ExtractKey<T, 226>;

export type ExtractContentJson<T> = 'content' extends keyof T
  ? 'application/json' extends keyof T['content']
    ? T['content']['application/json']
    : never
  : never;

type HasParameters = {
  parameters: Record<string, unknown>;
};

type ExtractParameters<T> = T extends HasParameters
  ? Partial<ExtractKey<T, 'parameters'>>
  : unknown;

type HasRequestBody = {
  requestBody: { content: { 'application/json': unknown } };
};

type AddRequestBodyIfExists<T, V> = T extends HasRequestBody
  ? V & { body: T['requestBody']['content']['application/json'] }
  : V;

type AddExtra<T> = T & {
  headers?: HeadersInit & { 'Content-type'?: ContentType };
};

type MakePathRequiredIfExists<T> = 'path' extends keyof T
  ? Omit<T, 'path'> & { path: T['path'] }
  : T;

export type Parameters<T> = MakePathRequiredIfExists<
  AddExtra<AddRequestBodyIfExists<T, ExtractParameters<T>>>
>;
type BaseParams = {
  query: Record<string, unknown>;
  body: Record<string, string>;
  path: Record<string, string>;
};
export type InnerParams = AddExtra<BaseParams>;

export type ContentType = '' | 'application/json';

export type ExtractFromAPI<
  P extends object,
  Path extends keyof P,
  Method extends keyof P[Path]
> = ExtractContentJson<
  ExtractSuccessfulHTTPResponse<ExtractResponses<P[Path][Method]>>
>;
