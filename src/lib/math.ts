export function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function clamp(min: number, number: number, max: number) {
  return Math.max(min, Math.min(number, max));
}
