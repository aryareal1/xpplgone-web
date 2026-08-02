/**
 * Await for `ms` millisecond
 * @param ms
 * @returns
 */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random 5 characters ID
 */
export function generateUid() {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
