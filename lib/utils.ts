import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pageTitle(page?: string) {
  return (page ? page + ' | ' : '') + process.env.NEXT_PUBLIC_CLASS_NAME;
}
