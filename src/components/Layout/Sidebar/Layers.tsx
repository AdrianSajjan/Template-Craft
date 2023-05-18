import * as React from "react";
import { ImageIcon, LockIcon, TypeIcon, FrameIcon, UnlockIcon } from "lucide-react";
import { Box, HStack, Icon, IconButton, Input, List, StackDivider, Text, VStack, chakra } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCanvas } from "@zocket/store/canvas";
import { ObjectType } from "@zocket/interfaces/fabric";

interface ListItemProps {
  name: string;
  type: ObjectType;

  isLocked?: boolean;
  isSelected?: boolean;

  onClick?: () => void;
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

    cursor: "pointer",
    borderRadius: "md",
    alignItems: "center",

    _hover: {
      backgroundColor: "gray.200",
    },
  },
});

const ListItem = observer(({ name, type, isSelected, isLocked, onClick }: ListItemProps) => {
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

  const InputIcon = isLocked ? LockIcon : UnlockIcon;
  const itemColor = isSelected ? "gray.200" : "white";
  const inputColor = isReadOnly ? "transparent" : "white";

  return (
    <Item role="button" tabIndex={0} backgroundColor={itemColor} onClick={onClick}>
      <Icon as={icons[type]} fontSize="sm" />
      <Input size="xs" fontWeight={500} border="none" tabIndex={-1} backgroundColor={inputColor} {...{ value, onChange, onBlur, isReadOnly, onDoubleClick, onMouseDown }} />
      <IconButton size="xs" variant="ghost" aria-label="Lock/Unlock" icon={<Icon as={InputIcon} fontSize="sm" />} />
    </Item>
  );
});

function LayerSidebar() {
  const [canvas] = useCanvas();

  const handleClick = (name: string) => () => {
    if (!canvas.instance) return;

    const objects = canvas.instance.getObjects();
    const target = objects.find((object) => object.name === name);

    if (!target) return;

    canvas.instance.setActiveObject(target).renderAll();
  };

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
      <VStack alignItems="stretch" divider={<StackDivider />} spacing="5" py="5" overflow="visible">
        <Box>
          <HStack pl="2" pr="2">
            <Text fontSize="sm" fontWeight={600}>
              Objects
            </Text>
          </HStack>
          <List pt="3" pb="2" px="2" spacing="2" height={250} overflowY="scroll">
            {canvas.objects.map((object) => {
              const isSelected = canvas.selected.name === object.name;
              return <ListItem key={object.name} onClick={handleClick(object.name)} {...{ ...object, isSelected }} />;
            })}
          </List>
        </Box>
        <Box></Box>
      </VStack>
    </Drawer>
  );
}

export default observer(LayerSidebar);
