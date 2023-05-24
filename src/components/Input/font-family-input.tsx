import { Box, Input, List as ChakraList, ListItem as ChakraListItem, ListItemProps, ScaleFade, Text, chakra, useDisclosure, Portal } from "@chakra-ui/react";
import { fonts } from "~/config/fonts";
import { observer } from "mobx-react-lite";
import * as React from "react";

interface FontFamilyInputProps {
  value?: string;
  onChange?: (font: string) => void;
}

const List = chakra(ChakraList, {
  baseStyle: {
    position: "absolute",
    maxHeight: 200,
    transform: "translateY(4px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
});

const Item = chakra(({ isHovered, ...props }: ListItemProps & { isHovered?: boolean }) => <ChakraListItem bgColor={isHovered ? "gray.100" : "white"} {...props} />, {
  baseStyle: {
    px: 3,
    py: 2,
    cursor: "pointer",
  },
});

function FontFamilyInput({ value, onChange }: FontFamilyInputProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [search, setSearch] = React.useState<string | undefined>(value);
  const [hovered, setHovered] = React.useState<string | undefined>(undefined);

  const input = React.useRef<HTMLInputElement | null>(null);
  const element = React.useRef<HTMLDivElement | null>(null);

  const width = React.useMemo(() => {
    if (!input.current) return 100;
    return input.current.getBoundingClientRect().width;
  }, [input.current]);

  const filtered = React.useMemo(() => {
    if (!search) return fonts;
    return fonts.filter((font) => font.trim().toLowerCase().includes(search.trim().toLowerCase()));
  }, [search]);

  const clickAwayListener = React.useCallback(
    (event: MouseEvent) => {
      const node = event.target as Node;
      if (!isOpen || !element.current || element.current.contains(node)) return;
      const font = hovered || value;
      if (!font) return;
      setHovered(undefined);
      setSearch(font);
      onChange?.(font);
      onClose();
    },
    [isOpen, hovered, element.current]
  );

  React.useEffect(() => {
    document.addEventListener("click", clickAwayListener);
    return () => {
      document.removeEventListener("click", clickAwayListener);
    };
  }, [clickAwayListener]);

  const onClick = (font: string) => {
    setSearch(font);
    onChange?.(font);
    onClose();
  };

  return (
    <Box position="relative" ref={element}>
      <Input ref={input} size="xs" value={search} onChange={(event) => setSearch(event.target.value)} onFocus={onOpen} />
      <ScaleFade in={isOpen} unmountOnExit>
        <List shadow="base" width={width}>
          {filtered.map((font) => (
            <Item key={font} isHovered={hovered === font} onMouseEnter={() => setHovered(font)} onClick={() => onClick(font)}>
              <Text fontSize="xs">{font}</Text>
            </Item>
          ))}
        </List>
      </ScaleFade>
    </Box>
  );
}

export default observer(FontFamilyInput);
