import { ObjectType } from "@zocket/interfaces/fabric";

export type Template = FabricTemplate | undefined | null;

export interface FabricTemplate {
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
