import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

import { Clipboard, FabricCanvas, FabricEvent, FabricObject, FabricSelectedState, FabricState, FabricTextbox } from "@zocket/interfaces/fabric";
import { exportedProps, maxUndoRedoSteps } from "@zocket/config/app";
import { nanoid } from "nanoid";

export class CanvasStore {
  canvas: FabricCanvas = null;

  clipboard: Clipboard = null;
  selected: FabricSelectedState = { status: false, type: "none", name: "", details: null };

  private undoStack: FabricState[] = [];
  private redoStack: FabricState[] = [];

  actionsEnabled: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  private get canUndo() {
    return this.actionsEnabled && this.undoStack.length > 1;
  }

  private get canRedo() {
    return this.actionsEnabled && this.redoStack.length > 0;
  }

  onUndo() {
    if (!this.canvas || !this.canUndo) return;

    this.actionsEnabled = false;

    const stack = [...this.undoStack];
    const currentState = stack.pop()!;
    const undoState = stack[stack.length - 1];

    this.undoStack = stack;
    this.redoStack = [...this.redoStack, currentState];

    this.loadFromJSON(undoState);
  }

  onRedo() {
    if (!this.canvas || !this.canRedo) return;

    this.actionsEnabled = false;

    const stack = [...this.redoStack];
    const redoState = stack.pop()!;

    this.redoStack = stack;
    this.undoStack = [...this.undoStack, redoState];

    this.loadFromJSON(redoState);
  }

  onSelect(event: FabricEvent) {
    const element = event.selected!.at(0)!;
    this.selected = { status: true, type: element.type!, name: element.name!, details: element.toObject(exportedProps) };
  }

  onDeselect() {
    this.selected = { status: false, type: "none", name: "", details: null };
  }

  onDuplicate() {
    this.onCopy();
    this.onPaste();
  }

  onSave(_: FabricEvent) {
    if (!this.canvas) return;

    this.redoStack = [];

    const state = this.canvas.toJSON(exportedProps);
    const element = this.canvas.getActiveObject();

    if (element) {
      this.selected.details = element.toObject(exportedProps);
    }

    if (this.undoStack.length < maxUndoRedoSteps) {
      this.undoStack.push(state);
    } else {
      this.undoStack.slice(1).push(state);
    }
  }

  onScale(event: FabricEvent) {
    if (!this.canvas) return;

    const element = event.target!;

    if (element.type === "textbox") {
      const text = element as FabricTextbox;
      text.set({ fontSize: Math.round(text.fontSize! * element.scaleY!), width: element.width! * element.scaleX!, scaleX: 1, scaleY: 1 });
    }

    this.canvas.renderAll();
  }

  onCopy() {
    if (!this.canvas) return;

    const element = this.canvas.getActiveObject();
    if (!element) return;

    element.clone((clone: FabricObject) => {
      this.clipboard = clone;
    }, exportedProps);
  }

  onPaste() {
    if (!this.canvas || !this.clipboard) return;
    this.clipboard.clone((clone: FabricObject) => {
      this.canvas!.discardActiveObject();

      clone.set({ name: nanoid(4), left: clone.left! + 10, top: clone.top! + 10, evented: true });
      clone.setCoords();

      this.canvas!.add(clone);
      this.canvas!.setActiveObject(clone);

      this.canvas!.fire("object:modified", { target: clone });
      this.canvas!.requestRenderAll();

      this.clipboard!.left! += 10;
      this.clipboard!.top! += 10;
    }, exportedProps);
  }

  onDelete() {
    if (!this.canvas) return;

    const element = this.canvas.getActiveObject();
    if (!element) return;

    this.canvas.remove(element);
    this.canvas.fire("object:modified", { target: null });
    this.canvas.requestRenderAll();
  }

  private loadFromJSON(state: FabricState) {
    if (!this.canvas) return;

    const active = this.selected.status ? this.selected.name : false;

    this.canvas.clear();

    this.canvas.loadFromJSON(state, () => {
      this.actionsEnabled = true;
      if (active) {
        const elements = this.canvas!.getObjects();
        for (const element of elements) {
          if (element.name === active) {
            this.canvas!.setActiveObject(element);
            break;
          }
        }
      }
      this.canvas!.renderAll();
    });
  }
}

export const CanvasContext = createContext<CanvasStore | undefined>(undefined);

export const CanvasProvider = CanvasContext.Provider;

export function useCanvasStore() {
  const context = useContext(CanvasContext);
  if (!context) return "Please wrap your components in Canvas Provider";
  return context;
}
