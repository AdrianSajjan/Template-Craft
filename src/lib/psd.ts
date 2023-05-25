import _ from "lodash";
import { Psd, Layer, readPsd, RGBA } from "ag-psd";
import { Template, TemplateState } from "~/interfaces/template";
import { nanoid } from "nanoid";
import { objectID } from "~/lib/nanoid";
import { ObjectType } from "~/interfaces/fabric";
import { defaultFont, defaultFontSize } from "~/config/fonts";
import { convertRGBAToHex } from "~/lib/colors";
import { createFactory } from "~/lib/utils";

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

    const value = type === "textbox" ? layer.text!.text : blob ? URL.createObjectURL(blob) : "";

    const color = (layer.text?.style?.fillColor ?? { a: 1, r: 0, g: 0, b: 0 }) as RGBA;

    const width = Math.ceil((layer.right || 0) - (layer.left || 0));

    const height = Math.ceil((layer.bottom || 0) - (layer.top || 0));

    const hex = convertRGBAToHex(color);

    const fontSize = Math.ceil(layer.text?.style?.fontSize || defaultFontSize);

    const fontFamily = layer.text?.style?.font?.name?.replace(/-/g, " ") || defaultFont;

    const data = {
      name,
      type,
      value,
      details: {
        width,
        height,
        top: layer.top,
        left: layer.left,
        opacity: layer.opacity,
        fill: type === "textbox" ? hex : undefined,
        fontSize: type === "textbox" ? fontSize : undefined,
        fontFamily: type === "textbox" ? fontFamily || defaultFont : undefined,
      },
    };

    state.push(data);
  }

  return state;
}

export async function convertCanvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return createFactory<Promise<Blob>, [(resolve: (value: Blob) => void, reject: (reason?: any) => void) => void]>(Promise, (resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject();
      else resolve(blob);
    });
  });
}
