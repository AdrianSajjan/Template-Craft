import { createFactory } from "~/lib/utils";

export async function createImageFromSource(source: string): Promise<HTMLImageElement> {
  return createFactory(Promise, (resolve: (value: HTMLImageElement) => void, reject: (error?: any) => void) => {
    const image = createFactory(Image);
    image.crossOrigin = "anonymous";
    image.src = source;
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.addEventListener("error", (event) => {
      reject(event.error);
    });
  });
}
