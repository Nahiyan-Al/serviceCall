/** Returns a new list with `x` toggled (added if absent, removed if present). */
export const toggleList = <T,>(x: T, lst: T[]): T[] =>
  lst.includes(x) ? lst.filter((y) => y !== x) : [...lst, x];
