export function getThumbnailUrl(url, { width = 400, height = 300 } = {}) {
  if (!url || !url.includes("/upload/")) {
    return url;
  }

  const transformation = `w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace("/upload/", `/upload/${transformation}/`);
}
