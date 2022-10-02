import { ExtractFromAPI, Parameters } from './types';
import { OmitKeysDeep } from './types-utils';
import { replacePathParameters } from './replacePathParameters';
import { serialize } from './serialize';

export const createRequest = <P extends object>(fetchFn = fetch) =>
  async function request<Path extends keyof P, Method extends keyof P[Path]>(
    path: Path,
    method: Method,
    parameters: OmitKeysDeep<
      Parameters<P[Path][Method]>,
      'query.session'
    > = {} as OmitKeysDeep<Parameters<P[Path][Method]>, 'query.session'>
  ): Promise<ExtractFromAPI<P, Path, Method>> {
    const {
      query = {},
      path: parametersPath,
      headers = {},
    } = parameters as unknown as {
      query: Record<string, unknown>;
      path: Record<string, string>;
      headers: HeadersInit;
    };

    const url = `${replacePathParameters(
      path as string,
      parametersPath
    )}?${serialize(query)}`;
    const params = {
      method: method as string,
      ...((<{ body: Record<string, string> }>(<unknown>parameters))?.body?.body
        ? {
            body: JSON.stringify(
              (<{ body: Record<string, string> }>(<unknown>parameters)).body
                .body
            ),
          }
        : {}),
      headers,
    };

    const response = await fetchFn(url, params);
    if (response.ok) {
      return response.json();
    }
    throw await response.json();
  };
