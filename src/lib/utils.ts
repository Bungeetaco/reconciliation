/**
 * Combines class names into a single string with filtering out falsy values.
 * @param classes - A list of class names to be combined.
 * @returns A string of combined class names.
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}
