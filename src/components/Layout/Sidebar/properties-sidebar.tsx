import * as React from "react";
import { observer } from "mobx-react-lite";
import { fabric as fabricJS } from "fabric";
import { RotateCcwIcon, RotateCwIcon } from "lucide-react";
import { Box, Button, ButtonGroup, Grid, HStack, Icon, IconButton, StackDivider, Text, Textarea, VStack, chakra } from "@chakra-ui/react";

import { ColorPickerInput, FontFamilyInput, PropertyInput } from "@zocket/components/Input";

import { toFixed } from "@zocket/lib/utils";
import { Canvas, useCanvas } from "@zocket/store/canvas";
import { ObjectType } from "@zocket/interfaces/fabric";

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
              <PropertyInput label="H" value={height} onChange={(height) => setHeight(+height)} onBlur={() => canvas.onChangeDimensions({ height })} />
              <PropertyInput label="W" value={width} onChange={(width) => setWidth(+width)} onBlur={() => canvas.onChangeDimensions({ width })} />
            </HStack>
          </Grid>
          <Grid display="none" templateColumns="100px 1fr" mt="4" alignItems="center">
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
            <ColorPickerInput value={canvas.background?.source} onChange={(color) => canvas.onChangeBackgroundColor(color)} />
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
  const selected = canvas.selected! as Required<fabricJS.Textbox>;

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
              <PropertyInput label="H" value={toFixed(selected.height)} isReadOnly />
              <PropertyInput label="W" value={toFixed(selected.width)} onChange={(value) => canvas.onTextPropertyChange("width", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput label="X" value={toFixed(selected.left)} onChange={(value) => canvas.onTextPropertyChange("left", +value)} />
              <PropertyInput label="Y" value={toFixed(selected.top)} onChange={(value) => canvas.onTextPropertyChange("top", +value)} />
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
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Font
          </Text>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Color
            </Text>
            <ColorPickerInput value={selected.fill as string} onChange={(color) => canvas.onTextPropertyChange("fill", color)} />
          </Grid>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Size
            </Text>
            <PropertyInput value={selected.fontSize} onChange={(value) => canvas.onTextPropertyChange("fontSize", +value)} />
          </Grid>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Family
            </Text>
            <FontFamilyInput value={selected.fontFamily} onChange={(value) => canvas.onFontFamilyChange(value)} />
          </Grid>
        </Box>
      </VStack>
    </Drawer>
  );
});

const ImagePropertySidebar = observer(({ canvas }: SidebarProps) => {
  const selected = canvas.selected! as Required<fabricJS.Image>;

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
              <PropertyInput label="H" value={selected.height} isReadOnly />
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
            Image
          </Text>
        </Box>
      </VStack>
    </Drawer>
  );
});

const RectPropertySidebar = observer(({ canvas }: SidebarProps) => {
  const selected = canvas.selected! as Required<fabricJS.Rect>;

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
              <PropertyInput label="H" value={selected.height} isReadOnly />
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
            Rect
          </Text>
        </Box>
      </VStack>
    </Drawer>
  );
});

const mapSidebar = {
  none: CanvasPropertySidebar,
  textbox: TextPropertySidebar,
  image: ImagePropertySidebar,
  rect: RectPropertySidebar,
};

function PropertySidebar() {
  const [canvas] = useCanvas();

  const selected = React.useMemo(() => {
    return (canvas.selected ? canvas.selected.type! : "none") as ObjectType;
  }, [canvas.selected]);

  const Sidebar = mapSidebar[selected];

  if (!canvas.instance) return <Drawer />;

  return <Sidebar canvas={canvas} />;
}

export default observer(PropertySidebar);
