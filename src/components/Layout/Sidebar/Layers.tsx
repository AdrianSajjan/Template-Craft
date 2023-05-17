import * as React from "react";
import { ImageIcon, LockIcon, TypeIcon, FrameIcon, UnlockIcon } from "lucide-react";
import { Box, HStack, Icon, IconButton, Input, List, StackDivider, Text, VStack, chakra } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCanvas } from "@zocket/store/canvas";
import { ObjectType } from "@zocket/interfaces/fabric";

interface ListItemProps {
  name: string;
  isUnlocked?: boolean;
  type: ObjectType;
}

const icons = {
  textbox: TypeIcon,
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

const ListItem = observer(({ name, type }: ListItemProps) => {
  const [value, setValue] = React.useState(name);
  const [isReadOnly, setReadOnly] = React.useState(true);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
  };

  const onMouseDown: React.MouseEventHandler<HTMLInputElement> = (event) => {
    if (event.detail > 1) event.preventDefault();
  };

  const onDoubleClick = () => {
    setReadOnly(false);
  };

  const onBlur = () => {
    setReadOnly(true);
  };

  const backgroundColor = isReadOnly ? "transparent" : "white";

  return (
    <Item>
      <Icon as={icons[type]} fontSize="sm" />
      <Input size="xs" fontWeight={500} border="none" backgroundColor={backgroundColor} {...{ value, onChange, onBlur, isReadOnly, onDoubleClick, onMouseDown }} />
      <IconButton size="xs" variant="ghost" aria-label="Lock/Unlock" icon={<Icon as={UnlockIcon} fontSize="sm" />} />
    </Item>
  );
});

function LayerSidebar() {
  const [canvas] = useCanvas();

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
            {canvas.objects.map((object) => (
              <ListItem key={object.name} name={object.name} type={object.type} />
            ))}
          </List>
        </Box>
        <Box></Box>
      </VStack>
    </Drawer>
  );
}

export default observer(LayerSidebar);
