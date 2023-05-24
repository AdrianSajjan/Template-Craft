import * as React from "react";
import { makeAutoObservable } from "mobx";

import { Canvas } from "~/store/canvas";

import { Media, Status } from "~/interfaces/app";
import { Optional } from "~/interfaces/core";
import { Template } from "~/interfaces/template";

export class TemplateStore {
  canvas: Canvas;

  active: Optional<Template>;
  status: Status;

  photos: Array<Media>;

  get isLoading() {
    return this.status === "pending";
  }

  constructor(canvas: Canvas) {
    makeAutoObservable(this);
    this.canvas = canvas;
    this.status = "uninitialized";
    this.photos = [];
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
