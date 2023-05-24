import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import { createFactory } from "~/lib/utils";
import { ToastContainer, theme } from "~/config/theme";

import { TemplateProvider, TemplateStore } from "~/store/template";
import { Canvas, CanvasProvider } from "~/store/canvas";

import App from "~/App";

const canvas = createFactory(Canvas);
const template = createFactory(TemplateStore, canvas);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CanvasProvider value={canvas}>
        <TemplateProvider value={template}>
          <App />
          <ToastContainer />
        </TemplateProvider>
      </CanvasProvider>
    </ChakraProvider>
  </React.StrictMode>
);
