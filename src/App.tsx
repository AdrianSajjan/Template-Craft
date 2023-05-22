import "@zocket/config/fabric";

import styled from "@emotion/styled";
import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Box, Button, ButtonGroup, CircularProgress, Icon, IconButton, chakra } from "@chakra-ui/react";

import { Main } from "@zocket/components/Layout/Main";
import { Header } from "@zocket/components/Layout/Header";
import { LayerSidebar, PropertySidebar } from "@zocket/components/Layout/Sidebar";

import { useCanvas } from "@zocket/store/canvas";
import { originalHeight, originalWidth } from "@zocket/config/app";
import { useTemplate } from "@zocket/store/template";
import { useZoom } from "@zocket/hooks/use-zoom";

const MainContainer = chakra(Box, {
  baseStyle: {
    p: 5,
    maxHeight: "calc(100vh - 60px)",

    flex: 1,
    overflow: "auto",

    display: "grid",
    placeItems: "center",
  },
});

const ZoomContainer = chakra(ButtonGroup, {
  baseStyle: {
    bottom: 25,
    right: 350,

    opacity: 0.5,
    position: "fixed",

    _hover: {
      opacity: 1,
    },
  },
});

const ZoomButton = chakra(IconButton, {
  baseStyle: {
    color: "black",
    colorScheme: "whiteAlpha",
    backgroundColor: "white",
  },
});

const ActivityIndicator = chakra(({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <Box display="grid" placeItems="center" zIndex={100} inset="0" position="fixed" backgroundColor="gray.200">
      <CircularProgress isIndeterminate color="black" />
    </Box>
  );
});

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

function App() {
  const template = useTemplate();
  const [canvas, ref] = useCanvas();

  const { zoom, canZoomIn, canZoomOut, onZoomIn, onZoomOut, onResetZoom } = useZoom({ zoom: 0.5 });

  const dimensions = useMemo(() => {
    return {
      transform: `scale(${zoom})`,
      width: (canvas.dimensions.width || originalWidth) * zoom,
      height: (canvas.dimensions.height || originalHeight) * zoom,
    };
  }, [zoom, canvas.dimensions]);

  const property_key = canvas.selected?.name ?? template.active?.key;

  return (
    <Box display="flex">
      <Layout>
        <Header />
        <Main>
          <LayerSidebar />
          <MainContainer id="canvas-container">
            <Box height={dimensions.height} width={dimensions.width} pos="relative">
              <CanvasContainer transform={dimensions.transform}>
                <canvas ref={ref} id="canvas" />
              </CanvasContainer>
            </Box>
          </MainContainer>
          <PropertySidebar key={property_key} />
        </Main>
      </Layout>
      <ZoomContainer isAttached size="md">
        <ZoomButton aria-label="Zoom Out" isDisabled={!canZoomOut} onClick={onZoomOut} icon={<Icon as={ZoomOutIcon} fontSize="lg" />} />
        <ZoomButton aria-label="Zoom In" isDisabled={!canZoomIn} onClick={onZoomIn} icon={<Icon as={ZoomInIcon} fontSize="lg" />} />
        <ZoomButton as={Button} fontSize="sm" onClick={onResetZoom}>
          Reset
        </ZoomButton>
      </ZoomContainer>
      <ActivityIndicator isLoading={template.isLoading} />
    </Box>
  );
}

export default observer(App);
