import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import { createFactory } from "@zocket/lib/utils";
import { ToastContainer, theme } from "@zocket/config/theme";
import { Canvas, CanvasProvider } from "@zocket/store/canvas";

import App from "@zocket/App";

const canvas = createFactory(Canvas);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CanvasProvider value={canvas}>
        <App />
        <ToastContainer />
      </CanvasProvider>
    </ChakraProvider>
  </React.StrictMode>
);
