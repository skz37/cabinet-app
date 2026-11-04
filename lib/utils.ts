import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge the MediFlow tokens from global.css, otherwise it reads
// `text-body` as a colour and drops `text-foreground` (or the reverse).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display', 'title-1', 'title-2', 'title-3', 'body', 'button', 'caption', 'chip'],
      radius: ['input', 'button', 'card', 'sheet'],
      shadow: ['e1', 'e2', 'e3'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
