import * as React from "react";
import { makeAutoObservable } from "mobx";

import { Canvas } from "@zocket/store/canvas";

import { Status } from "@zocket/interfaces/app";
import { Optional } from "@zocket/interfaces/core";
import { Template } from "@zocket/interfaces/template";

export class TemplateStore {
  canvas: Canvas;

  active: Optional<Template>;
  status: Status = "uninitialized";

  get isLoading() {
    return this.status === "pending";
  }

  constructor(canvas: Canvas) {
    makeAutoObservable(this);
    this.canvas = canvas;
  }

  onInitializeCanvas(canvas: Canvas) {
    this.canvas = canvas;
  }

  *onInitializeTemplate(template: Template) {
    this.status = "pending";
    yield this.canvas.onLoadFromTemplate(template);
    this.active = template;
    this.status = "success";
  }
}

export const TemplateContext = React.createContext<TemplateStore | undefined>(undefined);
TemplateContext.displayName = "TemplateContext";

export const TemplateProvider = TemplateContext.Provider;

export function useTemplate() {
  const context = React.useContext(TemplateContext);
  if (!context) throw new Error("Please wrap your component on TemplateProvider");
  return context;
}
