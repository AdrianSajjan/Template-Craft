import "@zocket/config/fabric";

import { fabric as fabricJS } from "fabric";
import { nanoid } from "nanoid";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import styled from "@emotion/styled";

import { Box, Input, useToast } from "@chakra-ui/react";

import { Header } from "@zocket/components/Layout/Header";
import { Main } from "@zocket/components/Layout/Main";
import { LayerSidebar, PropertySidebar } from "@zocket/components/Layout/Sidebar";

import { exportedProps, originalHeight, originalWidth } from "@zocket/config/app";
import { defaultFont, defaultFontSize } from "@zocket/config/fonts";
import { addFontFace } from "@zocket/lib/fonts";

import { useFabric } from "@zocket/hooks/useFabric";

import { FabricTemplate, Template } from "@zocket/interfaces/app";
import { FabricCanvas, FabricSelectedState, FabricStates, FabricTextbox, TextboxKeys } from "@zocket/interfaces/fabric";

const { Textbox, Image } = fabricJS;

export default function App() {
  const toast = useToast({ position: "top-right", isClosable: true, variant: "left-accent" });

  const [scale] = useState(0.4);

  const [template, setTemplate] = useState<Template>(null);
  const [selected, setSelected] = useState<FabricSelectedState>({ status: false, type: "none", name: "", details: null });

  const [undoStack, updateUndoStack] = useState<FabricStates>([]);
  const [_, updateRedoStack] = useState<FabricStates>([]);

  const canvas = useRef<FabricCanvas>(null);
  const image = useRef<HTMLInputElement>(null);

  const initFabric = useFabric({
    ref: canvas,
    state: [...undoStack].pop(),
    callback: () => {
      setSelected({ status: false, type: "none", name: "", details: null });
    },
  });

  const containerWidth = useMemo(() => originalWidth * scale, [scale]);
  const containerHeight = useMemo(() => originalHeight * scale, [scale]);

  const transform = useMemo(() => `scale(${scale})`, [scale]);

  const initializeCanvasBackground = useCallback((canvas: NonNullable<FabricCanvas>, template: FabricTemplate) => {
    switch (template.background) {
      case "color":
        canvas.setBackgroundColor(template.source, canvas.renderAll.bind(canvas));
        return;
      case "image":
        canvas.setBackgroundImage(template.source, canvas.renderAll.bind(canvas));
        return;
    }
  }, []);

  const initializeCanvasTemplate = useCallback(
    async (template: FabricTemplate) => {
      if (!canvas.current) return;
      canvas.current.clear();
      updateRedoStack([]);
      updateUndoStack([]);
      setTemplate(template);
      initializeCanvasBackground(canvas.current, template);
      for (const element of template.state) {
        switch (element.type) {
          case "textbox":
            const { error, name } = await addFontFace(element.details.fontFamily || defaultFont);
            if (error) toast({ title: "Error", description: error, status: "error" });
            const textbox = new Textbox(element.value!, { ...element.details, name: element.name, fontFamily: name });
            canvas.current.add(textbox);
        }
      }
      canvas.current.fire("object:modified", { target: null });
      canvas.current.requestRenderAll();
    },
    [canvas]
  );

  // dev-only -> replace with initialize undo stack in callback function in fabric initialization hook
  useEffect(() => {
    if (!canvas.current) return;
    const state = canvas.current.toObject();
    updateUndoStack([state]);
  }, []);

  // dev-only
  useEffect(() => {
    if (!template || !canvas.current) return;
    initializeCanvasTemplate(template);
  }, []);

  // useEffect(() => {
  //   if (!canvas.current) return;
  //   canvas.current.off();
  //   canvas.current.on("object:modified", saveCanvasState);
  //   canvas.current.on("object:scaling", handleObjectScaling);
  //   canvas.current.on("selection:created", updateSelectionState);
  //   canvas.current.on("selection:updated", updateSelectionState);
  //   canvas.current.on("selection:cleared", clearSelectionState);
  // }, [canvas, saveCanvasState, updateSelectionState]);

  const onOpenImageExplorer = () => {
    if (!image.current) return;
    image.current.click();
  };

  const onFileInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    onAddImage(url);
  };

  const onAddText = async () => {
    if (!canvas.current) return;
    const { error, name } = await addFontFace(defaultFont);
    if (error) toast({ title: "Error", description: error, status: "error" });
    const text = new Textbox("Text", { name: `Text-${nanoid(4)}`, fontFamily: name, fill: "#000000", fontSize: defaultFontSize });
    canvas.current.add(text);
    canvas.current.viewportCenterObject(text);
    canvas.current.setActiveObject(text);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();
  };

  const onAddImage = (source: string) => {
    if (!canvas.current) return;
    Image.fromURL(
      source,
      (image) => {
        image.scaleToHeight(500);
        image.scaleToWidth(500);
        canvas.current!.add(image);
        canvas.current!.viewportCenterObject(image);
        canvas.current!.setActiveObject(image);
        canvas.current!.fire("object:modified", { target: image });
        canvas.current!.requestRenderAll();
      },
      {
        name: `Image-${nanoid(4)}`,
        objectCaching: true,
      }
    );
  };

  const onTextFontChange = async (value: string) => {
    if (!canvas.current) return;
    const { error, name } = await addFontFace(value);
    if (error) toast({ title: "Error", description: error, status: "error" });
    const text = canvas.current.getActiveObject() as FabricTextbox;
    text.set("fontFamily", name);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();
    setSelected((state) => ({ ...state, details: text.toObject(exportedProps) }));
  };

  const onTextPropertyChange = (property: TextboxKeys) => (value: any) => {
    if (!canvas.current) return;
    const text = canvas.current.getActiveObject() as FabricTextbox;
    text.set(property, value);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();
    setSelected((state) => ({ ...state, details: text.toObject(exportedProps) }));
  };

  return (
    <Box display="flex">
      <Layout>
        <Header />
        <Main>
          <LayerSidebar selected={selected} />
          <MainContainer>
            <Box height={containerHeight} width={containerWidth} shadow="sm" pos="relative">
              <Input type="file" ref={image} accept="images/*" display="none" onChange={handleImageInputChange} onClick={onFileInputClick} />
              <CanvasContainer transform={transform}>
                <canvas ref={initFabric} />
              </CanvasContainer>
            </Box>
          </MainContainer>
          <PropertySidebar canvas={canvas.current} selected={selected} onTextPropertyChange={onTextPropertyChange} />
        </Main>
      </Layout>
    </Box>
  );
}

const MainContainer = styled(Box)`
  flex: 1;
  display: grid;
  padding: 20px;
  overflow: auto;
  place-items: center;
  max-height: calc(100vh - 60px);
`;

const CanvasContainer = styled(Box)`
  transform-origin: 0 0;
  top: 0;
  left: 0;
  position: absolute;
  height: ${originalHeight}px;
  width: ${originalWidth}px;
`;

const Layout = styled.div`
  display: flex;
  height: 100vh;
  flex: 1;
  flex-direction: column;
`;
