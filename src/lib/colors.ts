export function convertAlphaPercentageToHex(value: number) {
  return Math.round((value * 255) / 100)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
}

export function convertAlphaDecimalToHex(value: number) {
  return Math.round(value * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
}

export function convertHexToAlphaPercentage(value: string) {
  const decimal = parseInt(value, 16);
  return (decimal * 100) / 255;
}

export function isValidHexColor(color: string) {
  const hex = color.replace(/#/g, "");
  return color.at(0) === "#" && hex.length === 6 && !isNaN(Number("0x" + hex));
}