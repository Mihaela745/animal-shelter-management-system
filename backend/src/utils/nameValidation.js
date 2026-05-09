const FULL_NAME_REGEX =
  /^[A-ZĂÂÎȘȚ][a-zăâîșț'-]+(?:\s+[A-ZĂÂÎȘȚ][a-zăâîșț'-]+)+$/;

export function normalizeFullName(value = "") {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidFullName(value = "") {
  return FULL_NAME_REGEX.test(normalizeFullName(value));
}
