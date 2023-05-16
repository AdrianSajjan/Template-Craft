import { Box, Button, ButtonGroup, HStack, Icon, StackDivider, Text, chakra } from "@chakra-ui/react";
import { TypeIcon, ImageIcon, BoxIcon, TrashIcon, UndoIcon, RedoIcon, FrameIcon, CopyIcon } from "lucide-react";

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  return (
    <Appbar>
      <Button fontSize="xs" size="sm" width={130}>
        Upload PSD File
      </Button>
      <HStack spacing="2.5" divider={<StackDivider borderColor="gray.200" />}>
        <ButtonGroup spacing="0.5">
          <Action variant="ghost" isDisabled>
            <Icon as={FrameIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Frame
            </Text>
          </Action>
          <Action variant="ghost" isDisabled>
            <Icon as={TypeIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Text
            </Text>
          </Action>
          <Action variant="ghost" isDisabled>
            <Icon as={ImageIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Image
            </Text>
          </Action>
          <Action variant="ghost" isDisabled>
            <Icon as={BoxIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Shape
            </Text>
          </Action>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <Action variant="ghost">
            <Icon as={CopyIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Duplicate
            </Text>
          </Action>
          <Action variant="ghost">
            <Icon as={TrashIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Delete
            </Text>
          </Action>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <Action variant="ghost">
            <Icon as={UndoIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Undo
            </Text>
          </Action>
          <Action variant="ghost">
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
