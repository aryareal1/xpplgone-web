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
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Theme switch with a circular reveal growing from the click point
 * (View Transitions API). Falls back to a plain apply when unsupported.
 * Needs the ::view-transition CSS block in the app's globals.css.
 */
export function revealTheme(
  origin: { clientX: number; clientY: number },
  apply: () => void,
) {
  if (!document.startViewTransition) return apply();

  const { clientX: x, clientY: y } = origin;
  const r = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  // body has transition-colors; freeze it so the new snapshot is painted
  // with final colors immediately, else the reveal crossfades wrongly.
  document.documentElement.classList.add('vt-active');
  const t = document.startViewTransition(apply);
  t.finished.finally(() =>
    document.documentElement.classList.remove('vt-active'),
  );
  t.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${r}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 450,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
}
