import * as React from "react";
import { observer } from "mobx-react-lite";
import { ImageIcon, LockIcon, TypeIcon, FrameIcon, UnlockIcon } from "lucide-react";
import { Box, Button, HStack, Icon, IconButton, Input, List, StackDivider, Text, VStack, chakra, useToast } from "@chakra-ui/react";

import { Canvas, useCanvas } from "~/store/canvas";
import { ObjectType } from "~/interfaces/canvas";
import { nanoid } from "nanoid";

interface ListItemProps {
  name: string;
  canvas: Canvas;
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

    cursor: "pointer",
    borderRadius: "md",
    alignItems: "center",

    _hover: {
      backgroundColor: "gray.200",
    },
  },
});

const ListItem = observer(({ name, type, canvas }: ListItemProps) => {
  const toast = useToast();

  const [value, setValue] = React.useState(name);
  const [isReadOnly, setReadOnly] = React.useState(true);

  const onClick = () => {
    if (!canvas.instance) return;
    const target = canvas.instance.getObjects().find((object) => object.name === name);
    if (!target) return;
    canvas.instance.setActiveObject(target).renderAll();
  };

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

    if (!canvas.instance) return;
    const duplicate = name !== value ? canvas.instance.getObjects().some((object) => object.name === value) : false;

    if (duplicate) {
      setValue(name);
      toast({ title: "Duplicate name found", description: "Object names should be unique in the tree", variant: "left-accent", status: "info", isClosable: true });
      return;
    }

    const index = canvas.instance.getObjects().findIndex((object) => object.name === name);
    if (index !== -1) canvas.instance.getObjects().at(index)!.name = value;
  };

  const inputColor = isReadOnly ? "transparent" : "white";
  const itemColor = canvas.selected?.name === name ? "gray.200" : "white";

  return (
    <Item role="button" tabIndex={0} backgroundColor={itemColor} onClick={onClick}>
      <Icon as={icons[type]} fontSize="sm" />
      <Input size="xs" fontWeight={500} border="none" tabIndex={-1} backgroundColor={inputColor} {...{ value, onChange, onBlur, isReadOnly, onDoubleClick, onMouseDown }} />
      <IconButton size="xs" variant="ghost" aria-label="Lock/Unlock" icon={<Icon as={UnlockIcon} fontSize="sm" />} />
    </Item>
  );
});

function LayerSidebar() {
  const [canvas] = useCanvas();

  if (!canvas.instance) return <Drawer />;

  return (
    <Drawer>
      <VStack alignItems="stretch" divider={<StackDivider />} spacing="5" py="5" overflow="visible">
        <Box>
          <HStack pl="3" pr="2">
            <Text fontSize="sm" fontWeight={600}>
              Objects
            </Text>
          </HStack>
          <List pt="4" pb="2" px="2" spacing="2" height={300} overflowY="scroll">
            {canvas.objects.map((object) => (
              <ListItem key={object.name} canvas={canvas} {...object} />
            ))}
          </List>
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
}

export default observer(LayerSidebar);
