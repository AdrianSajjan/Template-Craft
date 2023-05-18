import "@zocket/config/fabric";

import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Box, Button, ButtonGroup, Icon, IconButton, chakra } from "@chakra-ui/react";

import { Main } from "@zocket/components/Layout/Main";
import { Header } from "@zocket/components/Layout/Header";
import { LayerSidebar, PropertySidebar } from "@zocket/components/Layout/Sidebar";

import { useCanvas } from "@zocket/store/canvas";
import { originalHeight, originalWidth } from "@zocket/config/app";
import { toJS } from "mobx";

const MainContainer = chakra(Box, {
  baseStyle: {
    position: "relative",

    p: 5,
    maxHeight: "calc(100vh - 60px)",

    flex: 1,
    overflow: "auto",

    display: "grid",
    placeItems: "center",
  },
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
  const [zoom] = useState(0.4);

  const [canvas, ref] = useCanvas();

  const dimensions = useMemo(() => {
    return {
      transform: `scale(${zoom})`,
      height: originalHeight * zoom,
      width: originalWidth * zoom,
    };
  }, [zoom]);

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
            <ButtonGroup bottom="6" right="8" position="absolute" isAttached size="sm" opacity={0.5} _hover={{ opacity: 1 }}>
              <IconButton aria-label="Zoom In" colorScheme="whiteAlpha" backgroundColor="white" color="black" icon={<Icon as={ZoomInIcon} fontSize="md" />} />
              <IconButton aria-label="Zoom Out" colorScheme="whiteAlpha" backgroundColor="white" color="black" icon={<Icon as={ZoomOutIcon} fontSize="md" />} />
              <Button fontSize="xs" colorScheme="whiteAlpha" backgroundColor="white" color="black">
                Reset
              </Button>
            </ButtonGroup>
          </MainContainer>
          <PropertySidebar key={canvas.selected.name} />
        </Main>
      </Layout>
    </Box>
  );
}

export default observer(App);

// const onOpenImageExplorer = () => {
//   if (!image.current) return;
//   image.current.click();
// };

// const onFileInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
//   const element = event.target as HTMLInputElement;
//   element.value = "";
// };

// const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//   if (!event.target.files) return;
//   const file = event.target.files[0];
//   const url = URL.createObjectURL(file);
//   // onAddImage(url);
// };
