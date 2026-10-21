export function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export function mailHref(
  value: string,
  options?: { subject?: string; body?: string }
): string {
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.body) params.set("body", options.body);
  const query = params.toString();
  return `mailto:${value.trim()}${query ? `?${query}` : ""}`;
}

export function waHref(value: string, text?: string): string {
  let href: string;
  if (/^https?:\/\//.test(value)) {
    href = value;
  } else {
    href = `https://wa.me/${value.replace(/[^\d]/g, "")}`;
  }
  if (text) {
    href += `${href.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
  }
  return href;
}
