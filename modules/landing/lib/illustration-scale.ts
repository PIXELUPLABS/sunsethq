export function createIllustrationScaler(width: number, height: number) {
  return {
    x: (value: number) => `${(value / width) * 100}cqw`,
    y: (value: number) => `${(value / height) * 100}cqh`,
  };
}
