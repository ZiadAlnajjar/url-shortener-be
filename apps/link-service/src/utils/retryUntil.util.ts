export async function retryUntil<T>(
  operation: () => T | Promise<T>,
  until: (result: T, error?: unknown) => boolean | Promise<boolean>,
  options: {
    maxRetries?: number;
    delayMs?: number;
  } = {
    maxRetries: 5,
    delayMs: 0,
  }
): Promise<T> {
  const maxRetries = options?.maxRetries;
  const delayMs = options?.delayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let result: T;
    let error: unknown = null;

    try {
      result = await operation();
    } catch (err) {
      error = err;
    }

    const success = await until?.(result, error);

    if (success) {
      if (error) throw error;
      return result;
    }

    if (attempt < maxRetries && delayMs > 0) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  throw new Error(`Retry limit reached after ${maxRetries} attempts.`);
}
