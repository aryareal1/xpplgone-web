import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce function to limit the rate at which a function can be called.
 * @param fn The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
