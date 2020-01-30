export function clamp(n: number, min: number, max: number) {
  return n > max ? max : n < min ? min : n
}
