import { RGBA, RGB } from "ag-psd";

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

export function convertRGBAToHex({ r, g, b, a }: RGBA) {
  const hex = (r | (1 << 8)).toString(16).slice(1) + (g | (1 << 8)).toString(16).slice(1) + (b | (1 << 8)).toString(16).slice(1);
  const alpha = a === undefined || a === null ? 1 : a;
  const hexWithAlpha = hex + ((alpha * 255) | (1 << 8)).toString(16).slice(1);
  return "#" + hexWithAlpha;
}

export function convertRGBToHex({ r, g, b }: RGB) {
  const hex = (r | (1 << 8)).toString(16).slice(1) + (g | (1 << 8)).toString(16).slice(1) + (b | (1 << 8)).toString(16).slice(1);
  return "#" + hex;
}
