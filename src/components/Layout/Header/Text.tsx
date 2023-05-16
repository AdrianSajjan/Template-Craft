import { Box, Button, ButtonGroup, Flex, HStack, Icon, IconButton } from "@chakra-ui/react";
import { FontColorPicker, FontSizeInput } from "@zocket/components/Input";
import { FabricSelectedState, TextboxKeys } from "@zocket/interfaces/fabric";
import { useMemo } from "react";

interface TextHeaderProps {
  selected: FabricSelectedState;
  isFontFamilySidebarOpen: boolean;
  onFontFamilySidebarToggle: () => void;
  onPropertySidebarToggle: () => void;
  onAnimationSidebarToggle: () => void;
  onTextPropertyChange: (property: TextboxKeys) => (value: any) => void;
}

const alignments = [
  {
    label: "Left Align",
    value: "left",
    icon: <Icon fontSize="2xl" />,
  },
  {
    label: "Center Align",
    value: "center",
    icon: <Icon fontSize="2xl" />,
  },
  {
    label: "Right Align",
    value: "right",
    icon: <Icon fontSize="2xl" />,
  },
];

export default function TextHeader({
  selected,
  isFontFamilySidebarOpen,
  onFontFamilySidebarToggle,
  onPropertySidebarToggle,
  onTextPropertyChange,
  onAnimationSidebarToggle,
}: TextHeaderProps) {
  const background = useMemo(() => (isFontFamilySidebarOpen ? "gray.200" : "white"), [isFontFamilySidebarOpen]);
  const align = useMemo(() => selected.details.textAlign, [selected]);

  const onFontAlignClick = (value: string) => () => onTextPropertyChange("textAlign")(value);

  return (
    <Box as={Flex} gap={4} overflowX="auto" flexWrap="wrap">
      <Button variant="outline" bgColor={background} onClick={onFontFamilySidebarToggle}>
        {selected.details.fontFamily}
      </Button>
      <FontSizeInput value={selected.details.fontSize} onChange={onTextPropertyChange("fontSize")} />
      <ButtonGroup isAttached>
        {alignments.map(({ icon, label, value }) => (
          <IconButton key={value} variant={align === value ? "solid" : "outline"} aria-label={label} icon={icon} onClick={onFontAlignClick(value)} />
        ))}
      </ButtonGroup>
      <FontColorPicker value={selected.details.fill} onChange={onTextPropertyChange("fill")} />
      <HStack ml="auto" spacing={4}>
        <Button variant="outline" onClick={onPropertySidebarToggle}>
          Properties
        </Button>
        <Button variant="solid" onClick={onAnimationSidebarToggle} colorScheme="blue">
          Animations
        </Button>
      </HStack>
    </Box>
  );
}
