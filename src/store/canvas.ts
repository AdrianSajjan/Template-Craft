import { makeAutoObservable, toJS } from "mobx";
import { fabric as fabricJS } from "fabric";
import { createContext, useCallback, useContext, useEffect } from "react";

import { extractAlphaAndBaseFromHex } from "~/lib/colors";
import { FontFaceResponse, addFontFace } from "~/lib/fonts";
import { objectID } from "~/lib/nanoid";
import { createFactory } from "~/lib/utils";

import { exportedProps, maxUndoRedoSteps, originalHeight, originalWidth } from "~/config/app";
import { defaultFont, defaultFontSize } from "~/config/fonts";
import { toast } from "~/config/theme";

import { Optional } from "~/interfaces/core";
import { Template } from "~/interfaces/template";
import { Filter, FilterKeys, FilterMap, ImageFilterMap } from "~/interfaces/filter";
import { CanvasMouseEvent, CanvasState, Clipboard, ImageKeys, ObjectType, SceneObject, Selected, TextboxKeys } from "~/interfaces/canvas";

type Dimensions = { height?: number; width?: number };
type Background = { type: "color" | "image"; source: string };

export class Canvas {
  instance: Optional<fabricJS.Canvas>;

  objects: SceneObject[];

  selected: Optional<Selected>;
  clipboard: Optional<Clipboard>;

  width: number;
  height: number;
  background: Optional<Background>;

  actionsEnabled: boolean;

  filters: ImageFilterMap;

  private undoStack: CanvasState[];
  private redoStack: CanvasState[];

  get dimensions() {
    return { height: this.height, width: this.width };
  }

  get canUndo() {
    return this.actionsEnabled && this.undoStack.length > 1;
  }

  get canRedo() {
    return this.actionsEnabled && this.redoStack.length > 0;
  }

  constructor() {
    makeAutoObservable(this);

    this.width = 0;
    this.height = 0;

    this.objects = [];
    this.undoStack = [];
    this.redoStack = [];

    this.actionsEnabled = true;
    this.filters = createFactory<ImageFilterMap, []>(Map);
  }

  private *onLoadFromJSON(state: CanvasState) {
    if (!this.instance) return;

    const active = this.selected ? this.selected.name : false;

    this.instance.clear();

    yield createFactory(Promise, (resolve) => this.instance!.loadFromJSON(state, resolve));

    if (active) {
      const elements = this.instance!.getObjects();
      for (const element of elements) {
        if (element.name === active) {
          this.instance!.setActiveObject(element);
          break;
        }
      }
    }

    this.onUpdateObjects();

    this.actionsEnabled = true;
    this.instance!.renderAll();
  }

  private onUpdateObjects() {
    if (!this.instance) return;
    const objects = this.instance.getObjects();
    this.objects = objects.map((object) => object.toObject(exportedProps)).map((object, index) => ({ name: object.name, type: object.type, index }));
    this.selected = this.instance.getActiveObject()?.toObject(exportedProps);
  }

  private onUpdateDimensions() {
    if (!this.instance) return;
    this.width = this.instance.width!;
    this.height = this.instance.height!;
  }

  private onUpdateBackground(background: Background) {
    this.background = background;
  }

  private onAddOrUpdateFilter(name: string, key: FilterKeys, value: Filter) {
    const hasFilters = this.filters.has(name);
    const filters = hasFilters ? this.filters.get(name)! : createFactory<FilterMap, []>(Map);
    filters.set(key, value);
    this.filters.set(name, filters);
    return;
  }

  private onRemoveFilter(name: string, key: FilterKeys) {
    const hasFilters = this.filters.has(name);
    if (!hasFilters) return;
    const filters = this.filters.get(name)!;
    filters.delete(key);
    this.filters.set(name, filters);
    return;
  }

  onInitialize(canvas: fabricJS.Canvas) {
    this.instance = canvas;

    this.height = canvas.height!;
    this.width = canvas.width!;
  }

  *onLoadFromTemplate(template: Template) {
    if (!this.instance) return;

    this.instance.clear();

    this.objects = [];
    this.redoStack = [];
    this.undoStack = [];

    this.selected = null;
    this.filters = createFactory<ImageFilterMap, []>(Map);

    this.onChangeBackground(template);
    this.onChangeDimensions({ height: template.height, width: template.width });

    for (const element of template.state) {
      switch (element.type) {
        case "textbox":
          const response: FontFaceResponse = yield addFontFace(element.details.fontFamily || defaultFont);
          if (response.error) toast({ title: "Warning", description: response.error, variant: "left-accent", status: "warning", isClosable: true });

          const textbox = createFactory(fabricJS.Textbox, element.value, { ...element.details, name: element.name, fontFamily: response.name });
          this.instance.add(textbox);
          break;

        case "image":
          const image: fabricJS.Image = yield createFactory(Promise, (resolve) => {
            fabricJS.Image.fromURL(element.value, (image) => resolve(image), { ...element.details, name: element.name, objectCaching: true });
          });
          this.instance.add(image);
          break;
      }
    }

    this.onUpdateObjects();

    this.instance.fire("object:modified", { target: null });
    this.instance.requestRenderAll();
  }

  *onLoadFromJSONTemplate() {}

  *onExportTemplateAsJSON() {
    if (!this.instance) return;
    const exported = this.instance.toObject(exportedProps);
    const serialized = JSON.stringify(exported, null, 4);
    yield navigator.clipboard.writeText(serialized);
    toast({ title: "Copied JSON to clipboard", variant: "left-accent", status: "success", isClosable: true });
  }

  onChangeBackground(template: Pick<Template, "background" | "source">) {
    if (!this.instance) return;

    switch (template.background) {
      case "color":
        this.instance.setBackgroundColor(template.source, this.instance.renderAll.bind(this.instance));
        break;

      case "image":
        this.instance.setBackgroundImage(template.source, this.instance.renderAll.bind(this.instance));
        break;
    }

    this.onUpdateBackground({ type: template.background, source: template.source });
  }

  onChangeDimensions({ height, width }: Dimensions) {
    if (!this.instance) return;

    if (width) this.instance.setWidth(+width).renderAll();
    if (height) this.instance.setHeight(+height).renderAll();

    this.onUpdateDimensions();
  }

  onChangeBackgroundColor(color: string) {
    if (!this.instance) return;
    this.instance.setBackgroundColor(color, this.instance.renderAll.bind(this.instance));
    this.onUpdateBackground({ type: "color", source: color });
  }

  *onUndo() {
    if (!this.instance || !this.canUndo) return;

    this.actionsEnabled = false;

    const stack = [...this.undoStack];
    const currentState = stack.pop()!;
    const undoState = stack[stack.length - 1];

    this.undoStack = stack;
    this.redoStack = [...this.redoStack, currentState];

    yield this.onLoadFromJSON(undoState);
  }

  *onRedo() {
    if (!this.instance || !this.canRedo) return;

    this.actionsEnabled = false;

    const stack = [...this.redoStack];
    const redoState = stack.pop()!;

    this.redoStack = stack;
    this.undoStack = [...this.undoStack, redoState];

    yield this.onLoadFromJSON(redoState);
  }

  onSelect(event: CanvasMouseEvent) {
    const element = event.selected!.at(0);
    this.selected = element!.toObject(exportedProps);
  }

  onDeselect() {
    this.selected = null;
  }

  onSave(_: CanvasMouseEvent) {
    if (!this.instance) return;

    this.redoStack = [];

    const state = this.instance.toObject(exportedProps);
    const element = this.instance.getActiveObject();

    if (element) {
      this.selected = element.toObject(exportedProps);
    }

    if (this.undoStack.length < maxUndoRedoSteps) {
      this.undoStack.push(state);
    } else {
      this.undoStack.splice(0, 1).push(state);
    }
  }

  onScale(event: CanvasMouseEvent) {
    if (!this.instance) return;

    const element = event.target!;

    if (element.type === "textbox") {
      const text = element as fabricJS.Textbox;
      text.set({ fontSize: Math.round(text.fontSize! * element.scaleY!), width: element.width! * element.scaleX!, scaleX: 1, scaleY: 1 });
    }

    this.instance.renderAll();
  }

  *onCopyObject() {
    if (!this.instance) return;

    const element = this.instance.getActiveObject();
    if (!element) return;

    const clone: Required<fabricJS.Object> = yield createFactory(Promise, (resolve) => element.clone((clone) => resolve(clone), exportedProps));
    this.clipboard = clone;
  }

  *onPasteObject() {
    if (!this.instance || !this.clipboard) return;

    const clone: fabricJS.Object = yield createFactory(Promise, (resolve) => this.clipboard!.clone((clone) => resolve(clone), exportedProps));

    clone.set({ name: objectID(clone.name!), left: clone.left! + 10, top: clone.top! + 10, evented: true });
    clone.setCoords();

    this.clipboard.left! += 10;
    this.clipboard.top! += 10;

    this.instance.add(clone);
    this.onUpdateObjects();
    this.instance.setActiveObject(clone).fire("object:modified", { target: clone }).renderAll();
  }

  *onDuplicateObject() {
    yield this.onCopyObject();
    yield this.onPasteObject();
  }

  onDeleteObject() {
    if (!this.instance) return;

    const element = this.instance.getActiveObject();
    if (!element) return;

    this.instance.remove(element);
    this.onUpdateObjects();
    this.instance.fire("object:modified", { target: null }).renderAll();
  }

  onObjectViewportPlacement(type: "horizontal" | "vertical" | "center") {
    if (!this.instance) return;

    const element = this.instance.getActiveObject();
    if (!element) return;

    switch (type) {
      case "center":
        this.instance.viewportCenterObject(element);
        break;

      case "horizontal":
        this.instance.viewportCenterObjectH(element);
        break;

      case "vertical":
        this.instance.viewportCenterObjectV(element);
        break;
    }

    this.instance.fire("object:modified", { target: element }).renderAll();
  }

  onChangeObjectDimension(property: "height" | "width", value: number) {
    if (!this.instance) return;

    const element = this.instance.getActiveObject() as Required<fabricJS.Object>;
    if (!element) return;

    const type = element.type as ObjectType;

    switch (type) {
      case "textbox":
        if (property === "height") return;
        element.set(property, value);
        break;
      case "rect":
        element.set(property, value);
        break;
      case "image":
        const scale = property === "height" ? value / element.height : value / element.width;
        const key = property === "height" ? "scaleY" : "scaleX";
        element.set(key, scale);
        break;
    }

    this.instance.fire("object:modified", { target: element }).renderAll();
  }

  onChangeObjectLayer(layer: "back" | "front" | "backward" | "forward" | number) {
    if (!this.instance) return;

    const element = this.instance.getActiveObject() as Required<fabricJS.Object>;
    if (!element) return;

    switch (layer) {
      case "back":
        element.sendToBack();
        break;
      case "backward":
        element.sendBackwards();
        break;
      case "front":
        element.bringToFront();
        break;
      case "forward":
        element.bringForward();
        break;
      default:
        element.moveTo(layer);
    }

    this.onUpdateObjects();

    this.instance.fire("object:modified", { target: element }).renderAll();
  }

  *onChangeFontFamily(fontFamily = defaultFont) {
    if (!this.instance) return;

    const response: FontFaceResponse = yield addFontFace(fontFamily);
    if (response.error) toast({ title: "Warning", description: response.error, variant: "left-accent", status: "warning", isClosable: true });

    const text = this.instance.getActiveObject() as Required<fabricJS.Textbox>;
    if (!text) return;

    text.set("fontFamily", response.name);

    this.instance.fire("object:modified", { target: text }).renderAll();
  }

  onChangeTextProperty(property: TextboxKeys, value: any) {
    if (!this.instance) return;

    const text = this.instance.getActiveObject() as Required<fabricJS.Textbox>;
    if (!text) return;

    text.set(property, value);

    this.instance.fire("object:modified", { target: text }).renderAll();
  }

  *onChangeImageSource(source: string) {
    if (!this.instance) return;

    const image = this.instance.getActiveObject() as Required<fabricJS.Image>;
    if (!image) return;

    const width = image.width * image.scaleX;
    const height = image.height * image.scaleY;

    yield createFactory(Promise, (resolve) => image.setSrc(source, () => resolve(image)));

    const scaleX = width / image.width;
    const scaleY = height / image.height;
    image.set("scaleX", scaleX).set("scaleY", scaleY);

    this.instance.fire("object:modified", { target: image }).renderAll();
  }

  onChangeImageProperty(property: ImageKeys, value: any) {
    if (!this.instance) return;

    const image = this.instance.getActiveObject() as Required<fabricJS.Image>;
    if (!image) return;

    image.set(property, value);

    this.instance.fire("object:modified", { target: image }).renderAll();
  }

  onFetchImageFilter(name: string, key: FilterKeys) {
    const hasFilters = this.filters.has(name);
    if (!hasFilters) return { active: false, value: null } as const;

    const filters = this.filters.get(name)!;

    const hasFilter = filters.has(key);
    if (!hasFilter) return { active: false, value: null } as const;

    const filter = filters.get(key)!;

    return { active: true, value: filter } as const;
  }

  onRemoveImageFilter(key: FilterKeys) {
    if (!this.instance) return;

    const image = this.instance.getActiveObject() as Required<fabricJS.Image>;
    if (!image) return;

    const filter = this.onFetchImageFilter(image.name, key);

    if (!filter.active) return;

    image.filters.splice(filter.value.index, 1);
    image.applyFilters();

    this.onRemoveFilter(image.name, key);

    this.instance.fire("object:modified", { target: image }).renderAll();
  }

  onAddOrEnableImageTint(hex: string, opacity?: number) {
    if (!this.instance) return;

    const image = this.instance.getActiveObject() as Required<fabricJS.Image>;
    if (!image) return;

    const { base: color, alphaAsDecimal } = extractAlphaAndBaseFromHex(hex);
    const alpha = opacity ?? alphaAsDecimal;

    const filter = createFactory(fabricJS.Image.filters.BlendColor, { color, alpha, mode: "tint" });

    const existing = this.onFetchImageFilter(image.name, "tint");
    const index = existing.active ? existing.value.index : image.filters.length;

    image.filters[index] = filter;
    image.applyFilters();

    const body = filter.toObject();
    this.onAddOrUpdateFilter(image.name, "tint", { index, ...body });

    this.instance.fire("object:modified", { target: image }).renderAll();
  }

  onAddImageMask() {
    if (!this.instance) return;

    const image = this.instance.getActiveObject() as Required<fabricJS.Image>;
    if (!image) return;

    const currentIndex = this.instance.getObjects().indexOf(image);
    const targetIndex = currentIndex - 1;

    const mask = this.instance.getObjects().at(targetIndex) as fabricJS.Image;

    if (!mask || mask.type !== "image") {
      toast({ title: "Unable to apply filter", description: "Please make sure image is in front of the mask", variant: "left-accent", status: "error", isClosable: true });
      return;
    }

    const filter = createFactory(fabricJS.Image.filters.BlendImage, { image: mask, mode: "mask" });

    const existing = this.onFetchImageFilter(image.name, "mask");
    const index = existing.active ? existing.value.index : image.filters.length;

    image.filters[index] = filter;
    image.applyFilters();

    const body = filter.toObject();
    this.onAddOrUpdateFilter(image.name, "mask", { index, ...body });

    this.instance.fire("object:modified", { target: image }).renderAll();
  }

  *onAddText(text = "Text", { fill = "#000000", fontSize = defaultFontSize }) {
    if (!this.instance) return;

    const response: FontFaceResponse = yield addFontFace(defaultFont);
    if (response.error) toast({ title: "Warning", description: response.error, variant: "left-accent", status: "warning", isClosable: true });

    const textbox = createFactory(fabricJS.Textbox, text, { name: objectID("text"), fontFamily: response.name, fill, fontSize });

    this.instance.add(textbox);
    this.instance.viewportCenterObject(textbox);
    this.instance.setActiveObject(textbox);

    this.instance.fire("object:modified", { target: textbox }).renderAll();
  }

  *onAddImage(source: string, { height = 500, width = 500 }) {
    if (!this.instance) return;

    const image: fabricJS.Image = yield createFactory(Promise, (resolve) => {
      fabricJS.Image.fromURL(source, (image) => resolve(image), { name: objectID("image"), objectCaching: true });
    });

    image.scaleToHeight(height);
    image.scaleToWidth(width);

    this.instance.add(image);
    this.instance.viewportCenterObject(image);
    this.instance.setActiveObject(image);

    this.instance.fire("object:modified", { target: image }).renderAll();
  }
}

export const CanvasContext = createContext<Canvas | undefined>(undefined);
export const CanvasProvider = CanvasContext.Provider;

export function useCanvas(props?: { onInitialize?: (canvas: Canvas) => void }) {
  const canvas = useContext(CanvasContext);

  if (!canvas) throw new Error("Please wrap your components in Canvas Provider");

  const ref = useCallback((element: HTMLCanvasElement) => {
    if (!element) {
      canvas.instance?.dispose();
    } else {
      const options = { width: originalWidth, height: originalHeight, preserveObjectStacking: true, backgroundColor: "#FFFFFF", centeredRotation: true, selection: false };
      const fabric = createFactory(fabricJS.Canvas, element, options);
      canvas.onInitialize(fabric);
      props?.onInitialize?.(canvas);
    }
  }, []);

  const clickAwayListener = useCallback(
    (event: MouseEvent) => {
      if (!canvas.instance) return;

      const target = event.target as HTMLElement;
      if (target.id !== "canvas-container") return;

      canvas.onDeselect();
      canvas.instance.discardActiveObject().renderAll();
    },
    [canvas.instance]
  );

  useEffect(() => {
    if (!canvas.instance) return;

    canvas.instance.off();

    canvas.instance.on("object:modified", canvas.onSave.bind(canvas));
    canvas.instance.on("object:scaling", canvas.onScale.bind(canvas));

    canvas.instance.on("selection:created", canvas.onSelect.bind(canvas));
    canvas.instance.on("selection:updated", canvas.onSelect.bind(canvas));
    canvas.instance.on("selection:cleared", canvas.onDeselect.bind(canvas));

    window.addEventListener("mousedown", clickAwayListener);

    return () => {
      window.removeEventListener("mousedown", clickAwayListener);
    };
  }, [canvas.instance, clickAwayListener]);

  return [canvas, ref] as const;
}
