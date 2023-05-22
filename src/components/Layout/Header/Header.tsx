import * as React from "react";
import { nanoid } from "nanoid";
import { flowResult } from "mobx";
import { observer } from "mobx-react-lite";
import { Box, Button, ButtonGroup, HStack, Icon, StackDivider, Text, chakra } from "@chakra-ui/react";
import { TypeIcon, ImageIcon, BoxIcon, TrashIcon, UndoIcon, RedoIcon, FrameIcon, CopyIcon } from "lucide-react";

import { useCanvas } from "@zocket/store/canvas";
import { useTemplate } from "@zocket/store/template";

import { BringToFront } from "@zocket/components/Icons/Front";
import { SendToBackIcon } from "@zocket/components/Icons/Back";

import { templates } from "@zocket/mock/templates";

interface HeaderProps {}

const Appbar = chakra(Box, {
  baseStyle: {
    px: 4,
    py: 1,
    minHeight: 16,

    backgroundColor: "#ffffff",
    borderBottom: "1.5px solid #e2e8f0",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const Action = chakra(Button, {
  baseStyle: {
    display: "flex",
    flexDirection: "column",
    py: 1.5,
    height: "auto",
    fontWeight: 400,
  },
});

function Header({}: HeaderProps) {
  const [canvas] = useCanvas();
  const template = useTemplate();

  const onUploadPSDFile = async () => {
    const selected = templates.at(0)!;
    await flowResult(template.onInitializeTemplate({ ...selected, key: nanoid() }));
  };

  return (
    <Appbar>
      <Button fontSize="xs" size="sm" width={130} onClick={onUploadPSDFile}>
        Upload PSD File
      </Button>
      <HStack spacing="2.5" divider={<StackDivider borderColor="gray.200" />}>
        <ButtonGroup spacing="0.5">
          <Action variant="ghost">
            <Icon as={FrameIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Frame
            </Text>
          </Action>
          <Action variant="ghost">
            <Icon as={TypeIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Text
            </Text>
          </Action>
          <Action variant="ghost">
            <Icon as={ImageIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Image
            </Text>
          </Action>
          <Action variant="ghost">
            <Icon as={BoxIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Shape
            </Text>
          </Action>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <Action variant="ghost" isDisabled={!canvas.selected}>
            <Icon as={CopyIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Duplicate
            </Text>
          </Action>
          <Action variant="ghost" isDisabled={!canvas.selected}>
            <Icon as={SendToBackIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Back
            </Text>
          </Action>
          <Action variant="ghost" isDisabled={!canvas.selected}>
            <Icon as={BringToFront} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Front
            </Text>
          </Action>
          <Action variant="ghost" isDisabled={!canvas.selected}>
            <Icon as={TrashIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Delete
            </Text>
          </Action>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <Action variant="ghost" isDisabled={!canvas.canUndo} onClick={canvas.onUndo.bind(canvas)}>
            <Icon as={UndoIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Undo
            </Text>
          </Action>
          <Action variant="ghost" isDisabled={!canvas.canRedo} onClick={canvas.onRedo.bind(canvas)}>
            <Icon as={RedoIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Redo
            </Text>
          </Action>
        </ButtonGroup>
      </HStack>
      <Button size="sm" fontSize="xs" background="black" colorScheme="blackAlpha" textColor="white" width={130}>
        Save Template
      </Button>
    </Appbar>
  );
}

export default observer(Header);
