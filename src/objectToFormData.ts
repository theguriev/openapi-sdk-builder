/**
 * Convert simple object into FormData instance.
 *
 * @param object object to convert.
 * @returns FormData instance with input object data.
 */
export const objectToFormData = (object: Record<string, string | Blob>) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    formData.append(key, object[key]);
  });
  return formData;
};
