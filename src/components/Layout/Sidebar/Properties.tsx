import { Box, Button, ButtonGroup, Flex, Grid, HStack, Icon, IconButton, StackDivider, Text, VStack, chakra } from "@chakra-ui/react";
import { PropertyInput } from "@zocket/components/Input";
import ColorPicker from "@zocket/components/Input/Color";
import { RotateCcwIcon, RotateCwIcon } from "lucide-react";

interface SidebarProps {}

export default function PropertySidebar({}: SidebarProps) {
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
              <PropertyInput label="H" />
              <PropertyInput label="W" />
            </HStack>
          </Grid>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Background
            </Text>
            <ButtonGroup size="xs" width="full" isAttached>
              <Button flex={1} fontSize="xs" fontWeight={500}>
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
              <PropertyInput label="H" />
              <PropertyInput label="W" />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput label="X" />
              <PropertyInput label="Y" />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
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
        </Box>
      </VStack>
    </Drawer>
  );
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

// const isText = useMemo(() => (selected.details ? selected.details.type === "textbox" : false), [selected]);

//   const handleViewportHCenter = () => {
//     if (!canvas) return;
//     const element = canvas.getActiveObject()!;
//     canvas.viewportCenterObjectH(element);
//     element.setCoords();
//     canvas.fire("object:modified", { target: element });
//   };

//   const handleViewportVCenter = () => {
//     if (!canvas) return;
//     const element = canvas.getActiveObject()!;
//     canvas.viewportCenterObjectV(element);
//     element.setCoords();
//     canvas.fire("object:modified", { target: element });
//   };

//   const handlePropertyChange = (property: ObjectKeys) => (value: string) => {
//     onTextPropertyChange(property)(parseFloat(value));
//   };

//   const handleDimensionChange = (property: "height" | "width") => (value: string) => {
//     if (!canvas) return;
//     const element = canvas.getActiveObject()!;
//     if (property === "height") {
//       if (element.type === "textbox") return;
//       if (element.type === "image") {
//         const scale = parseFloat(value) / element.height!;
//         element.set("scaleY", scale);
//       } else {
//         element.set("height", parseFloat(value));
//       }
//     } else {
//       if (element.type === "image") {
//         const scale = parseFloat(value) / element.width!;
//         element.set("scaleX", scale);
//       } else {
//         element.set("width", parseFloat(value));
//       }
//     }
//     canvas.requestRenderAll();
//   };
