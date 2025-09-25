export type Result<T, E> = { success: true; data: T } | { success: false; data: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E>(data: E): Result<never, E> {
  return { success: false, data };
}

export function fold<T, E, R>(
  result: Result<T, E>,
  onOk: (data: T) => R,
  onErr: (error: E) => R
): R {
  return result.success ? onOk(result.data) : onErr(result.data);
}

export function map<T, E, U>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
  return result.success ? ok(fn(result.data)) : result;
}

export function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return result.success ? result : err(fn(result.data));
}
