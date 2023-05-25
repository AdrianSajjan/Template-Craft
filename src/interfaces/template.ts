import { ObjectType } from "~/interfaces/canvas";

export interface Template {
  id: string;
  key?: string;
  source: string;
  background: "image" | "color";
  height: number;
  width: number;
  state: Array<TemplateState>;
}

export interface TemplateState {
  type: ObjectType;
  name: string;
  details: any;
  value: string;
}
