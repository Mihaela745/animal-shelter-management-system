export function normalizeFullName(value = "") {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidFullName(value = "") {
  return /^[A-ZĂÂÎȘȚ][a-zăâîșț'-]+(?:\s+[A-ZĂÂÎȘȚ][a-zăâîșț'-]+)+$/.test(
    normalizeFullName(value),
  );
}
