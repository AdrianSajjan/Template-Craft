import * as React from "react";
import { observer } from "mobx-react-lite";
import { fabric as fabricJS } from "fabric";
import { RotateCcwIcon, RotateCwIcon } from "lucide-react";
import { Box, Button, ButtonGroup, Grid, HStack, Icon, IconButton, Input, StackDivider, Text, Textarea, Tooltip, VStack, chakra } from "@chakra-ui/react";

import { ColorPickerInput, FontFamilyInput, PropertyInput } from "@zocket/components/Input";

import { toFixed } from "@zocket/lib/utils";
import { ObjectType } from "@zocket/interfaces/fabric";
import { Canvas, useCanvas } from "@zocket/store/canvas";
import { textAlignments, viewportAlignment } from "@zocket/constants/alignment";
import { nanoid } from "nanoid";
import { flowResult } from "mobx";

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

const Image = chakra("img", {
  baseStyle: {
    display: "block",
  },
});

const CanvasPropertySidebar = observer(({ canvas }: SidebarProps) => {
  const [width, setWidth] = React.useState(canvas.instance!.width);
  const [height, setHeight] = React.useState(canvas.instance!.height);

  const onChangeHeight = (value: string) => {
    setHeight(+value);
    canvas.onChangeDimensions({ height: +value });
  };

  const onChangeWidth = (value: string) => {
    setWidth(+value);
    canvas.onChangeDimensions({ width: +value });
  };

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
              <PropertyInput label="H" value={height} onChange={onChangeHeight} />
              <PropertyInput label="W" value={width} onChange={onChangeWidth} />
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
        <Box />
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
              <PropertyInput label="H" value={toFixed(selected.height)} isReadOnly isDisabled />
              <PropertyInput label="W" value={toFixed(selected.width)} onChange={(value) => canvas.onChangeObjectDimension("width", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput label="X" value={toFixed(selected.left)} onChange={(value) => canvas.onChangeTextProperty("left", +value)} />
              <PropertyInput label="Y" value={toFixed(selected.top)} onChange={(value) => canvas.onChangeTextProperty("top", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center" display="none">
            <Text fontSize="xs" fontWeight={500}>
              Rotation
            </Text>
            <HStack spacing="3">
              <PropertyInput />
              <ButtonGroup size="xs">
                <IconButton variant="outline" aria-label="Increase Rotation" icon={<Icon as={RotateCcwIcon} />} />
                <IconButton variant="outline" aria-label="Decrease Rotation" icon={<Icon as={RotateCwIcon} />} />
              </ButtonGroup>
            </HStack>
          </Grid>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Text
          </Text>
          <Textarea mt="3" fontSize="sm" px="2.5" value={selected.text} onChange={(event) => canvas.onChangeTextProperty("text", event.target.value)} />
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Font
          </Text>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Color
            </Text>
            <ColorPickerInput value={selected.fill as string} onChange={(color) => canvas.onChangeTextProperty("fill", color)} />
          </Grid>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Size
            </Text>
            <PropertyInput value={selected.fontSize} onChange={(value) => canvas.onChangeTextProperty("fontSize", +value)} />
          </Grid>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Family
            </Text>
            <FontFamilyInput value={selected.fontFamily} onChange={(value) => canvas.onChangeFontFamily(value)} />
          </Grid>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Alignment
          </Text>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Text
            </Text>
            <ButtonGroup size="sm" isAttached>
              {textAlignments.map(({ icon, name, value }) => {
                const variant = value === selected.textAlign ? "solid" : "outline";
                const color = value === selected.textAlign ? "gray.300" : "transparent";
                const onClick = () => canvas.onChangeTextProperty("textAlign", value);
                return (
                  <Tooltip key={name} openDelay={500} hasArrow label={name} placement="bottom-end" fontSize="xs">
                    <IconButton variant={variant} onClick={onClick} backgroundColor={color} aria-label={name} icon={<Icon as={icon} fontSize={16} />} flex={1} />
                  </Tooltip>
                );
              })}
            </ButtonGroup>
          </Grid>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Viewport
            </Text>
            <ButtonGroup size="sm" variant="outline" isAttached>
              {viewportAlignment.map(({ icon, name, value }) => (
                <Tooltip key={name} openDelay={500} fontSize="xs" label={name} placement="bottom-end" hasArrow>
                  <IconButton aria-label={name} icon={<Icon as={icon} fontSize={15} />} onClick={() => canvas.onObjectViewportPlacement(value)} flex={1} />
                </Tooltip>
              ))}
            </ButtonGroup>
          </Grid>
        </Box>
      </VStack>
    </Drawer>
  );
});

const ImagePropertySidebar = observer(({ canvas }: SidebarProps) => {
  const selected = canvas.selected! as Required<fabricJS.Image> & { src: string };

  const scaled = { width: selected.width * selected.scaleX, height: selected.height * selected.scaleY };

  const [width, setWidth] = React.useState(scaled.width);
  const [height, setHeight] = React.useState(scaled.height);

  const [shouldUpdate, setShouldUpdate] = React.useState(true);

  if (scaled.width !== width && shouldUpdate) setWidth(scaled.width);
  if (scaled.height !== height && shouldUpdate) setHeight(scaled.height);

  const explorer = React.useRef<HTMLInputElement | null>(null);

  const onShouldUpdate = () => {
    setShouldUpdate(true);
  };

  const onPreventUpdate = () => {
    setShouldUpdate(false);
  };

  const onChangeHeight = (value: string) => {
    setHeight(+value);
    canvas.onChangeObjectDimension("height", +value);
  };

  const onChangeWidth = (value: string) => {
    setWidth(+value);
    canvas.onChangeObjectDimension("width", +value);
  };

  const onOpenImageExplorer = () => {
    if (!explorer.current) return;
    explorer.current.click();
  };

  const onClickImageExplorer = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  const onChangeImageExplorer = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files.item(0)!;
    const url = URL.createObjectURL(file);
    await flowResult(canvas.onChangeImageSource(url));
  };

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
              <PropertyInput label="H" value={height} onChange={onChangeHeight} onFocus={onPreventUpdate} onBlur={onShouldUpdate} />
              <PropertyInput label="W" value={width} onChange={onChangeWidth} onFocus={onPreventUpdate} onBlur={onShouldUpdate} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput label="X" value={selected.left} onChange={(value) => canvas.onChangeTextProperty("left", +value)} />
              <PropertyInput label="Y" value={selected.top} onChange={(value) => canvas.onChangeTextProperty("top", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center" display="none">
            <Text fontSize="xs" fontWeight={500}>
              Rotation
            </Text>
            <HStack spacing="3">
              <PropertyInput />
              <ButtonGroup size="xs">
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
          <Box mt="4">
            <Image src={selected.src} height="full" width="full" />
            <ButtonGroup mt="2.5" isAttached variant="outline" size="sm" width="full">
              <Button fontSize="xs" flex={1} onClick={onOpenImageExplorer}>
                Change Image
              </Button>
              <Button fontSize="xs" flex={1}>
                Crop Image
              </Button>
            </ButtonGroup>
            <Input ref={explorer} type="file" onChange={onChangeImageExplorer} onClick={onClickImageExplorer} hidden />
          </Box>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Alignment
          </Text>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Viewport
            </Text>
            <ButtonGroup size="sm" variant="outline" isAttached>
              {viewportAlignment.map(({ icon, name, value }) => (
                <Tooltip key={name} openDelay={500} fontSize="xs" label={name} placement="bottom-end" hasArrow>
                  <IconButton aria-label={name} icon={<Icon as={icon} fontSize={15} />} onClick={() => canvas.onObjectViewportPlacement(value)} flex={1} />
                </Tooltip>
              ))}
            </ButtonGroup>
          </Grid>
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
              <PropertyInput label="W" value={selected.width} onChange={(value) => canvas.onChangeTextProperty("width", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput label="X" value={selected.left} onChange={(value) => canvas.onChangeTextProperty("left", +value)} />
              <PropertyInput label="Y" value={selected.top} onChange={(value) => canvas.onChangeTextProperty("top", +value)} />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center" display="none">
            <Text fontSize="xs" fontWeight={500}>
              Rotation
            </Text>
            <HStack spacing="3">
              <PropertyInput />
              <ButtonGroup size="xs">
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
