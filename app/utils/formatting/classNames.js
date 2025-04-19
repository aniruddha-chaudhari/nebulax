// Utility functions for merging Tailwind CSS class names with proper precedence

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for merging Tailwind CSS classes
 * @param  {...any} inputs - Class names to merge
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}