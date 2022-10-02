/**
 * Converts an object into a Cookie-like string.
 * @param toSerialize object or array to be serialized
 * @param prefix used in deep objects to describe the final query parameter
 * @returns ampersand separated key=value pairs
 *
 * Example:
 * ```js
 * serialize({hello:[{world: "nice"}]}); // outputs  "hello[0][world]=nice"
 * ```
 * ---
 * Adapted to TS from a StackOverflow answer https://stackoverflow.com/a/1714899/4537906
 */
export const serialize = (
  toSerialize?: Record<string, unknown>,
  prefix?: string
) => {
  if (!toSerialize) {
    return '';
  }
  const keyValuePairs: Array<string> = [];

  Object.keys(toSerialize).forEach((attribute) => {
    if (Object.prototype.hasOwnProperty.call(toSerialize, attribute)) {
      const key = prefix ? `${prefix}[${attribute}]` : attribute;
      const value = toSerialize[attribute];
      const toBePushed =
        value !== null && typeof value === 'object'
          ? serialize(value as Record<string, unknown>, key)
          : `${key}=${String(value)}`;
      keyValuePairs.push(toBePushed);
    }
  });

  return keyValuePairs.join('&');
};
