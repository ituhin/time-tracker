export function unixTimestamp(): number {
  return Math.floor(+new Date() / 1000);
}