/**
 * Replaces placeholders with real data.
 *
 * **Example:**
 * ```js
 * replacePathParameters('/user/{id}', { id: 123 }) // /user/123
 * ```
 *
 * @param path with placeholders /something/{placeholderKey}.
 * @param parameters with real data { placeholderKey: 123 }.
 * @returns path with data.
 */
export const replacePathParameters = (
  path: string,
  parameters: Record<string, string>
) =>
  path.replace(/{([\w.]*)}/g, (fullKey, key: string) => {
    const value = parameters[key];
    if (typeof value === 'undefined') {
      throw new Error(`Expected 'parameters' to have key: 'key' in ${path}`);
    }
    return value ? `${value}` : fullKey;
  });
