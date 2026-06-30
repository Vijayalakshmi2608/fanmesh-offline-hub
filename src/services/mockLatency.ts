export async function withMockLatency<T>(factory: () => T, min = 300, max = 800): Promise<T> {
  const span = Math.max(max - min, 0);
  const wait = min + Math.floor(Math.random() * (span + 1));
  await new Promise((resolve) => setTimeout(resolve, wait));
  return factory();
}

export function cloneMock<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}
