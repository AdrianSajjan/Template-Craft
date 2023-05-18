import { ObjectType } from "@zocket/interfaces/fabric";

export interface Template {
  index: string;
  source: string;
  background: "image" | "color";
  state: Array<TemplateState>;
}

export interface TemplateState {
  type: ObjectType;
  name: string;
  details: any;
  value: string;
}
