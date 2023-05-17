import * as React from "react";
import { ImageIcon, LockIcon, TypeIcon, FrameIcon } from "lucide-react";
import { Box, HStack, Icon, IconButton, Input, List, StackDivider, Text, VStack, chakra } from "@chakra-ui/react";

interface SidebarProps {}

interface ListItemProps {
  name: string;
  isUnlocked?: boolean;
  type: "icon" | "text" | "frame";
}

export default function LayerSidebar({}: SidebarProps) {
  return (
    <Drawer>
      <VStack alignItems="stretch" divider={<StackDivider />} spacing="5" py="5">
        <Box pl="3" pr="2">
          <HStack>
            <Text fontSize="sm" fontWeight={600}>
              Objects
            </Text>
          </HStack>
          <List mt="3" spacing="2" height={250} overflowY="scroll">
            <ListItem key="" name="text_d13" type="text" />
          </List>
        </Box>
        <Box></Box>
      </VStack>
    </Drawer>
  );
}

function ListItem({ name, type }: ListItemProps) {
  //
  const [value, setValue] = React.useState(name);
  const [isReadOnly, setReadOnly] = React.useState(true);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
  };

  const onDoubleClick = () => {
    setReadOnly(false);
  };

  const onMouseDown = (event) => {
    if (event.detail > 1) event.preventDefault();
  };

  const onBlur = () => {
    setReadOnly(true);
    // handleChange(value);
  };

  const backgroundColor = isReadOnly ? "transparent" : "white";

  return (
    <Item>
      <Icon as={icons[type]} fontSize="sm" />
      <Input size="xs" fontWeight={500} border="none" backgroundColor={backgroundColor} {...{ value, onChange, onBlur, isReadOnly, onDoubleClick, onMouseDown }} />
      <IconButton size="xs" variant="ghost" aria-label="Lock/Unlock" icon={<Icon as={LockIcon} fontSize="sm" />} />
    </Item>
  );
}

const icons = {
  text: TypeIcon,
  image: ImageIcon,
  frame: FrameIcon,
};

const Drawer = chakra("aside", {
  baseStyle: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",

    backgroundColor: "white",
    borderRight: "1.5px solid #e2e8f0",

    width: 275,
    overflow: "auto",
  },
});

const Item = chakra(HStack, {
  baseStyle: {
    pl: 2,
    pr: 1,
    py: 1,

    alignItems: "center",
    borderRadius: "md",

    _hover: {
      backgroundColor: "gray.200",
    },
  },
});

// const isText = useMemo(() => (selected.details ? selected.details.type === "textbox" : false), [selected]);
