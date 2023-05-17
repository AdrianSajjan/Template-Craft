import { Box, Button, ButtonGroup, Grid, HStack, Icon, IconButton, StackDivider, Text, Textarea, VStack, chakra } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import * as React from "react";

import { ColorPicker, PropertyInput } from "@zocket/components/Input";
import { Canvas, useCanvas } from "@zocket/store/canvas";
import { RotateCcwIcon } from "lucide-react";
import { RotateCwIcon } from "lucide-react";

interface SidebarProps {
  canvas: Canvas;
}

const Drawer = chakra("aside", {
  baseStyle: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",

    backgroundColor: "white",
    borderLeft: "1.5px solid #e2e8f0",

    width: 320,
    overflow: "auto",
  },
});

const CanvasPropertySidebar = observer(({ canvas }: SidebarProps) => {
  //
  const [width, setWidth] = React.useState(canvas.instance!.width);
  const [height, setHeight] = React.useState(canvas.instance!.height);

  return (
    <Drawer>
      <VStack alignItems="stretch" spacing="5" py="5" divider={<StackDivider borderColor="gray.200" />}>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Canvas
          </Text>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Size
            </Text>
            <HStack spacing="3">
              <PropertyInput label="H" value={height} onChange={(_, height) => setHeight(height)} onBlur={() => canvas.onChangeDimensions({ height })} />
              <PropertyInput label="W" value={width} onChange={(_, width) => setWidth(width)} onBlur={() => canvas.onChangeDimensions({ width })} />
            </HStack>
          </Grid>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Background
            </Text>
            <ButtonGroup size="xs" width="full" isAttached>
              <Button variant="solid" flex={1} fontSize="xs" fontWeight={500}>
                Color
              </Button>
              <Button variant="outline" flex={1} fontSize="xs" fontWeight={500}>
                Image
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Color
            </Text>
            <ColorPicker />
          </Grid>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Export
          </Text>
          <VStack mt="4">
            <Button size="sm" fontSize="xs" width="full">
              Export - PNG
            </Button>
            <Button size="sm" fontSize="xs" width="full">
              Export - ML Template
            </Button>
            <Button size="sm" fontSize="xs" width="full">
              Export - Canvas JSON
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Drawer>
  );
});

const TextPropertySidebar = observer(({ canvas }: SidebarProps) => {
  const selected = canvas.selected.details;

  return (
    <Drawer>
      <VStack alignItems="stretch" spacing="5" py="5" divider={<StackDivider borderColor="gray.200" />}>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Layout
          </Text>
          <Grid templateColumns="80px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Size
            </Text>
            <HStack spacing="3">
              <PropertyInput label="H" value={Math.round(selected.height)} isReadOnly />
              <PropertyInput label="W" value={selected.width} onChange={(value) => canvas.onTextPropertyChange("width", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput label="X" value={selected.left} onChange={(value) => canvas.onTextPropertyChange("left", +value)} />
              <PropertyInput label="Y" value={selected.top} onChange={(value) => canvas.onTextPropertyChange("top", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center" display="none">
            <Text fontSize="xs" fontWeight={500}>
              Rotation
            </Text>
            <HStack spacing="3">
              <PropertyInput />
              <ButtonGroup>
                <IconButton variant="outline" size="xs" aria-label="Increase Rotation" icon={<Icon as={RotateCcwIcon} />} />
                <IconButton variant="outline" size="xs" aria-label="Decrease Rotation" icon={<Icon as={RotateCwIcon} />} />
              </ButtonGroup>
            </HStack>
          </Grid>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Text
          </Text>
          <Textarea mt="3" fontSize="sm" px="2.5" value={selected.text} onChange={(event) => canvas.onTextPropertyChange("text", event.target.value)} />
        </Box>
      </VStack>
    </Drawer>
  );
});

const mapSidebar = {
  none: CanvasPropertySidebar,
  textbox: TextPropertySidebar,
  image: TextPropertySidebar,
  rect: TextPropertySidebar,
};

function PropertySidebar() {
  const [canvas] = useCanvas();

  const selected = React.useMemo(() => {
    return canvas.selected.type;
  }, [canvas.selected]);

  const Sidebar = mapSidebar[selected];

  if (!canvas.instance)
    return (
      <Drawer>
        <Box px="6" py="4">
          <Text fontSize="sm" fontWeight="medium">
            Loading...
          </Text>
        </Box>
      </Drawer>
    );

  return <Sidebar canvas={canvas} />;
}

export default observer(PropertySidebar);
