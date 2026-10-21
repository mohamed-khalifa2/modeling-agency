const lightSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 10"><rect width="8" height="10" fill="#ece8e0"/><rect y="5.5" width="8" height="4.5" fill="#ddd8ce"/></svg>';

const darkSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 10"><rect width="8" height="10" fill="#1c1c1c"/><rect y="5.5" width="8" height="4.5" fill="#141414"/></svg>';

export const blurPlaceholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(lightSvg)}`;

export const blurPlaceholderDark = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(darkSvg)}`;
