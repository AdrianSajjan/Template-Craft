import { filter } from "~/constants/filter";

export type CanvasMouseEvent = fabric.IEvent<MouseEvent>;

export type Clipboard = Required<fabric.Object> | null;

export type Selected = Required<fabric.Object> | null;

export type ObjectType = "textbox" | "image" | "rect";

export type ObjectKeys = keyof fabric.Object;

export type TextboxKeys = keyof fabric.Textbox;

export type ImageKeys = keyof fabric.Image;

export type CanvasState = { version: string; objects: fabric.Object[]; background?: string };

export type SceneObject = { name: string; type: ObjectType; index: number };
