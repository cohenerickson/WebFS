export function randomId(): number {
  return Math.ceil(Math.random() * Number.MIN_SAFE_INTEGER);
}

export function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 8);
}
