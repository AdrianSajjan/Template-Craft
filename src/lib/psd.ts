import _ from "lodash";
import { nanoid } from "nanoid";
import { Psd, Layer, readPsd, RGBA } from "ag-psd";

import { objectID } from "~/lib/nanoid";
import { createFactory } from "~/lib/utils";
import { convertRGBAToHex } from "~/lib/colors";

import { defaultFont, defaultFontSize } from "~/config/fonts";

import { ObjectType } from "~/interfaces/canvas";
import { Template, TemplateState } from "~/interfaces/template";

export function fetchPSDLayers(psd: Psd): Layer[] {
  const parsePSDLayers = (layers: Layer[]): Layer | Layer[] => {
    return _.flattenDeep(layers.map((layer) => (layer.children ? parsePSDLayers(layer.children) : layer)));
  };
  return _.flattenDeep([parsePSDLayers(psd.children || [])]);
}

export async function parsePSDFromFile(file: File) {
  const buffer = await file.arrayBuffer();
  const psd = readPsd(buffer);
  return psd;
}

export async function convertPSDToTemplate(psd: Psd): Promise<Template> {
  const id = nanoid();

  const layers = fetchPSDLayers(psd);

  const state: TemplateState[] = await convertLayersToState(layers);

  return { id, key: id, background: "color", source: "#FFFFFF00", height: psd.height, width: psd.width, state };
}

export async function convertLayersToState(layers: Layer[]): Promise<TemplateState[]> {
  const state: TemplateState[] = [];

  for (const layer of layers) {
    const type: ObjectType = layer.text ? "textbox" : "image";

    const name = layer.name ? layer.name : objectID(type);

    const blob = layer.canvas ? await convertCanvasToBlob(layer.canvas) : null;

    const value = type === "textbox" ? layer.text!.text.replace(/\x03/g, " ") : blob ? URL.createObjectURL(blob) : "";

    const color = (layer.text?.style?.fillColor ?? { a: 1, r: 0, g: 0, b: 0 }) as RGBA;

    const width = Math.ceil((layer.right || 0) - (layer.left || 0));

    const height = Math.ceil((layer.bottom || 0) - (layer.top || 0));

    const hex = convertRGBAToHex(color);

    const fontSize = Math.ceil(layer.text?.style?.fontSize || defaultFontSize);

    const fontFamily = layer.text?.style?.font?.name?.replace(/-/g, " ") || defaultFont;

    const details = {
      top: layer.top,
      left: layer.left,
      opacity: layer.opacity,
      fill: type === "textbox" ? hex : undefined,
      width: type === "textbox" ? width + 12 : width,
      height: type !== "textbox" ? height : undefined,
      fontSize: type === "textbox" ? fontSize : undefined,
      fontFamily: type === "textbox" ? fontFamily || defaultFont : undefined,
    };

    const sanitized = _(details).omitBy(_.isUndefined).value();

    const data = {
      name,
      type,
      value,
      details: sanitized,
    };

    state.push(data);
  }

  return state;
}

export async function convertCanvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return createFactory(Promise, (resolve: (value: Blob) => void, reject: (error?: any) => void) => {
    canvas.toBlob((blob) => {
      if (!blob) reject();
      else resolve(blob);
    });
  });
}
