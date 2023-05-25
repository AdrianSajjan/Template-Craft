import * as React from "react";
import { convertRGBToHex } from "~/lib/colors";
import { createImageFromSource } from "~/lib/engine";

export function useEyeDrop(source: string, onPickColor?: (color: string) => void) {
  const [eyeDropColor, setEyeDropColor] = React.useState<string>();
  const [isEyeDropActive, setEyeDropActive] = React.useState(false);

  const eyeDropCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!eyeDropCanvasRef.current) return;
    createImageFromSource(source).then((image) => {
      if (!eyeDropCanvasRef.current) return;

      const context = eyeDropCanvasRef.current.getContext("2d");
      if (!context) return;

      const maxWidth = 279;

      const aspectRatio = image.height / image.width;
      const width = image.width > maxWidth ? maxWidth : image.width;
      const height = width * aspectRatio;

      image.width = width;
      image.height = height;

      eyeDropCanvasRef.current.width = width;
      eyeDropCanvasRef.current.height = height;

      eyeDropCanvasRef.current.style.width = width + "px";
      eyeDropCanvasRef.current.style.height = height + "px";

      context.drawImage(image, 0, 0, width, height);
      const data = context.getImageData(0, 0, height, width).data;

      if (!isEyeDropActive) eyeDropCanvasRef.current.removeEventListener("mousedown", handlePickColor);
      else eyeDropCanvasRef.current.addEventListener("mousedown", handlePickColor);

      function handlePickColor(event: MouseEvent) {
        if (!isEyeDropActive) return;
        const columns = eyeDropCanvasRef.current!.width;
        const { offsetX, offsetY } = event;
        const pixels = columns * offsetX + offsetY;
        const position = pixels * 4;
        const rgb = { r: data[position], g: data[position + 1], b: data[position + 2] };
        const hex = convertRGBToHex(rgb);
        setEyeDropColor(hex);
        setEyeDropActive(false);
        eyeDropCanvasRef.current!.removeEventListener("mousedown", handlePickColor);
        navigator.clipboard.writeText(hex);
        onPickColor?.(hex);
      }
    });
  }, [eyeDropCanvasRef, source, isEyeDropActive]);

  const onStartEyeDrop = () => {
    setEyeDropActive(true);
  };

  const onEndEyeDrop = () => {
    setEyeDropActive(false);
  };

  return { eyeDropCanvasRef, eyeDropColor, isEyeDropActive, onStartEyeDrop, onEndEyeDrop };
}
