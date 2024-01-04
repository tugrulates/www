export function circularSlice(array: any[], start: number, end: number): any[] {
  const n = array.length;
  start = ((start % n) + n) % n;
  end = ((end % n) + n) % n;

  if (start < end) {
    return array.slice(start, end);
  } else {
    return [...array.slice(start, n), ...array.slice(0, end)];
  }
}
