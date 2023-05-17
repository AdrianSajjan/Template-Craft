export type CanvasMouseEvent = fabric.IEvent<MouseEvent>;

export type Clipboard = fabric.Object | null;

export type ObjectType = "textbox" | "image" | "rect";

export type ObjectKeys = keyof fabric.Object;

export type TextboxKeys = keyof fabric.Textbox;

export interface CanvasState {
  version: string;
  objects: fabric.Object[];
  background?: string;
}

export interface SelectedState {
  name: string;
  details: any;
  status: boolean;
  type: ObjectType | "none";
}

export interface SceneObject {
  name: string;
  type: ObjectType;
  isLocked: boolean;
}
