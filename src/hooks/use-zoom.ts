import { useState } from "react";

export function useZoom({ zoom = 0.4, step = 0.1, min = 0.1, max = 1 }) {
  const [scale, setScale] = useState(zoom);

  const onZoomIn = () => {
    setScale((state) => (state + step > max ? max : state + step));
  };

  const onZoomOut = () => {
    setScale((state) => (state - step < min ? min : state - step));
  };

  const onResetZoom = () => {
    setScale(zoom);
  };

  const canZoomIn = scale < max;
  const canZoomOut = scale > min;

  return { zoom: scale, canZoomIn, canZoomOut, onZoomIn, onZoomOut, onResetZoom, onZoom: setScale };
}
