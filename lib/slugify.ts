// utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // replace spaces & non-word chars with -
    .replace(/^-+|-+$/g, ""); // remove starting/ending dashes
}
