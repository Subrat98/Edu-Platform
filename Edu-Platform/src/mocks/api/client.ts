export interface MockApiOptions {
  latencyMs?: [number, number];
  failRate?: number;
}

/**
 * Every mock service call is routed through this single helper so
 * simulated network latency and error injection are centralized and
 * demo-able in one place. When a real Django REST Framework backend
 * replaces the mock layer, callers are untouched — only each service
 * function's body changes.
 */
export async function mockRequest<T>(
  resolver: () => T,
  opts: MockApiOptions = {},
): Promise<T> {
  const [min, max] = opts.latencyMs ?? [250, 600];
  const delay = min + Math.random() * (max - min);
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (opts.failRate && Math.random() < opts.failRate) {
    throw new Error("Simulated network error — please try again.");
  }

  const value = resolver();
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);
}
