import { Box, HStack, StackDivider, Text, VStack, chakra } from "@chakra-ui/react";
import { FabricSelectedState } from "@zocket/interfaces/fabric";

interface SidebarProps {
  selected: FabricSelectedState;
}

export default function LayerSidebar({}: SidebarProps) {
  return (
    <Drawer>
      <VStack alignItems="stretch" divider={<StackDivider />} spacing="4" py={5}>
        <Box px={4}>
          <HStack>
            <Text fontSize="sm" fontWeight={600}>
              Objects
            </Text>
          </HStack>
          <VStack></VStack>
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
    borderRight: "1.5px solid #e2e8f0",

    width: 250,
    overflow: "auto",
  },
});

// const isText = useMemo(() => (selected.details ? selected.details.type === "textbox" : false), [selected]);
