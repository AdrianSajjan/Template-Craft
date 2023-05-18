import { nanoid } from "nanoid";
import { makeAutoObservable } from "mobx";
import { fabric as fabricJS } from "fabric";
import { createContext, useCallback, useContext, useEffect } from "react";

import { createFactory } from "@zocket/lib/utils";
import { FontFaceResponse, addFontFace } from "@zocket/lib/fonts";

import { toast } from "@zocket/config/theme";
import { defaultFont, defaultFontSize } from "@zocket/config/fonts";
import { exportedProps, maxUndoRedoSteps, originalHeight, originalWidth } from "@zocket/config/app";

import { Clipboard, CanvasMouseEvent, ObjectType, SelectedState, CanvasState, TextboxKeys, SceneObject } from "@zocket/interfaces/fabric";
import { Template } from "@zocket/interfaces/template";

export class Canvas {
  instance: fabricJS.Canvas | null = null;

  objects: SceneObject[] = [];
  selected: SelectedState = { status: false, type: "none", name: "", details: null };

  clipboard: Clipboard = null;
  actionsEnabled: boolean = true;

  private undoStack: CanvasState[] = [];
  private redoStack: CanvasState[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get canUndo() {
    return this.actionsEnabled && this.undoStack.length > 1;
  }

  get canRedo() {
    return this.actionsEnabled && this.redoStack.length > 0;
  }

  onInitialize(canvas: fabricJS.Canvas) {
    this.instance = canvas;
  }

  *onLoadFromTemplate(template: Template) {
    if (!this.instance) return;

    this.instance.clearContext(this.instance.getContext());
    this.instance.clear();

    this.objects = [];
    this.redoStack = [];
    this.undoStack = [];

    this.onChangeBackground(template);

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

      this.objects.push({ name: element.name, type: element.type, isLocked: false });
    }

    this.instance.fire("object:modified", { target: null });
    this.instance.requestRenderAll();
  }

  onChangeBackground(template: Pick<Template, "background" | "source">) {
    if (!this.instance) return;

    switch (template.background) {
      case "color": {
        this.instance.setBackgroundColor(template.source, this.instance.renderAll.bind(this.instance));
        break;
      }

      case "image": {
        this.instance.setBackgroundImage(template.source, this.instance.renderAll.bind(this.instance));
        break;
      }
    }
  }

  onChangeDimensions({ height, width }: { height?: number | string; width?: number | string }) {
    if (!this.instance) return;
    if (width) this.instance.setWidth(width);
    if (height) this.instance.setHeight(height);
    this.instance.requestRenderAll();
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
    const element = event.selected!.at(0)!;
    this.selected = { status: true, type: element.type! as ObjectType, name: element.name!, details: element.toObject(exportedProps) };
  }

  onDeselect() {
    this.selected = { status: false, type: "none", name: "", details: null };
  }

  onDuplicate() {
    this.onCopy();
    this.onPaste();
  }

  onSave(_: CanvasMouseEvent) {
    if (!this.instance) return;

    this.redoStack = [];

    const state = this.instance.toJSON(exportedProps);
    const element = this.instance.getActiveObject();

    if (element) {
      this.selected.details = element.toObject(exportedProps);
    }

    if (this.undoStack.length < maxUndoRedoSteps) {
      this.undoStack.push(state);
    } else {
      this.undoStack.slice(1).push(state);
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

  onCopy() {
    if (!this.instance) return;

    const element = this.instance.getActiveObject();
    if (!element) return;

    element.clone((clone: fabricJS.Object) => {
      this.clipboard = clone;
    }, exportedProps);
  }

  onPaste() {
    if (!this.instance || !this.clipboard) return;
    this.clipboard.clone((clone: fabricJS.Object) => {
      this.instance!.discardActiveObject();

      clone.set({ name: `frame_${nanoid(3)}`, left: clone.left! + 10, top: clone.top! + 10, evented: true });
      clone.setCoords();

      this.instance!.add(clone);
      this.instance!.setActiveObject(clone);

      this.instance!.fire("object:modified", { target: clone });
      this.instance!.requestRenderAll();

      this.clipboard!.left! += 10;
      this.clipboard!.top! += 10;
    }, exportedProps);
  }

  onDelete() {
    if (!this.instance) return;

    const element = this.instance.getActiveObject();
    if (!element) return;

    this.instance.remove(element);
    this.instance.fire("object:modified", { target: null });
    this.instance.requestRenderAll();
  }

  *onFontFamilyChange(fontFamily = defaultFont) {
    if (!this.instance) return;

    const response: FontFaceResponse = yield addFontFace(fontFamily);
    if (response.error) toast({ title: "Warning", description: response.error, variant: "left-accent", status: "warning", isClosable: true });

    const text = this.instance.getActiveObject() as fabricJS.Textbox;
    text.set("fontFamily", response.name);

    this.selected.details = text.toObject(exportedProps);

    this.instance.fire("object:modified", { target: text }).renderAll();
  }

  onTextPropertyChange(property: TextboxKeys, value: fabricJS.Textbox[TextboxKeys]) {
    if (!this.instance) return;

    const text = this.instance.getActiveObject() as fabricJS.Textbox;

    text.set(property, value);

    this.selected.details = text.toObject(exportedProps);
    this.instance.fire("object:modified", { target: text }).renderAll();
  }

  *onAddText(text = "Text", { fill = "#000000", fontSize = defaultFontSize }) {
    if (!this.instance) return;

    const response: FontFaceResponse = yield addFontFace(defaultFont);
    if (response.error) toast({ title: "Warning", description: response.error, variant: "left-accent", status: "warning", isClosable: true });

    const textbox = createFactory(fabricJS.Textbox, text, { name: `text_${nanoid(3)}`, fontFamily: response.name, fill, fontSize });

    this.instance.add(textbox);
    this.instance.viewportCenterObject(textbox);
    this.instance.setActiveObject(textbox);

    this.instance.fire("object:modified", { target: textbox }).renderAll();
  }

  *onAddImage(source: string, { height = 500, width = 500 }) {
    if (!this.instance) return;

    const image: fabricJS.Image = yield createFactory(Promise, (resolve) => {
      fabricJS.Image.fromURL(source, (image) => resolve(image), { name: `image_${nanoid(3)}`, objectCaching: true });
    });

    image.scaleToHeight(height);
    image.scaleToWidth(width);

    this.instance!.add(image);
    this.instance!.viewportCenterObject(image);
    this.instance!.setActiveObject(image);

    this.instance!.fire("object:modified", { target: image });
    this.instance!.requestRenderAll();
  }

  *onLoadFromJSON(state: CanvasState) {
    if (!this.instance) return;

    const active = this.selected.status ? this.selected.name : false;

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

    this.actionsEnabled = true;
    this.instance!.renderAll();
  }
}

export const CanvasContext = createContext<Canvas | undefined>(undefined);
CanvasContext.displayName = "CanvasContext";

export const CanvasProvider = CanvasContext.Provider;

type ResolveCallback = (canvas: Canvas) => void;

export function useCanvas() {
  const canvas = useContext(CanvasContext);

  if (!canvas) throw new Error("Please wrap your components in Canvas Provider");

  const ref = useCallback((element: HTMLCanvasElement) => {
    if (!element) {
      canvas.instance?.dispose();
    } else {
      const options = { width: originalWidth, height: originalHeight, preserveObjectStacking: true, backgroundColor: "#FFFFFF", selection: false };
      const fabric = createFactory(fabricJS.Canvas, element, options);
      canvas.onInitialize(fabric);
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

//   const handleViewportHCenter = () => {
//     if (!canvas) return;
//     const element = canvas.getActiveObject()!;
//     canvas.viewportCenterObjectH(element);
//     element.setCoords();
//     canvas.fire("object:modified", { target: element });
//   };

//   const handleDimensionChange = (property: "height" | "width") => (value: string) => {
//     if (!canvas) return;
//     const element = canvas.getActiveObject()!;
//     if (property === "height") {
//       if (element.type === "textbox") return;
//       if (element.type === "image") {
//         const scale = parseFloat(value) / element.height!;
//         element.set("scaleY", scale);
//       } else {
//         element.set("height", parseFloat(value));
//       }
//     } else {
//       if (element.type === "image") {
//         const scale = parseFloat(value) / element.width!;
//         element.set("scaleX", scale);
//       } else {
//         element.set("width", parseFloat(value));
//       }
//     }
//     canvas.requestRenderAll();
//   };
