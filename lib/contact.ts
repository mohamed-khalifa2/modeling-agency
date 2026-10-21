export function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export function mailHref(value: string): string {
  return `mailto:${value.trim()}`;
}

export function waHref(value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  return `https://wa.me/${value.replace(/[^\d]/g, "")}`;
}
