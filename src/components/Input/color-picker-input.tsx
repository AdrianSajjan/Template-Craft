import { Grid, Input, chakra, Button, Box, useDisclosure } from "@chakra-ui/react";
import { ColorPickerModal } from "@zocket/components/Modal";
import { convertAlphaDecimalToHex, convertHexToAlphaPercentage } from "@zocket/lib/colors";
import { ChangeEvent, FocusEvent, useMemo, useState } from "react";
import { ColorResult } from "react-color";

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ColorPickerInput({ value = "#000000", onChange }: ColorPickerProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const [color, setColor] = useState(value);

  const parsed = useMemo(() => {
    const alpha = color.length === 9 ? color.substring(7) : "FF";
    const base = color.length === 9 ? color.substring(0, 7) : color;
    return {
      color: base,
      alpha: +convertHexToAlphaPercentage(alpha).toFixed(0),
    };
  }, [color]);

  const onChangePicker = (color: ColorResult) => {
    const opacity = color.rgb.a !== undefined ? convertAlphaDecimalToHex(color.rgb.a) : "FF";
    const result = color.hex.toUpperCase() + opacity;
    setColor(result);
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {};

  const onChangeOpacity = (event: ChangeEvent<HTMLInputElement>) => {};

  const onBlurOpacity = (event: FocusEvent<HTMLInputElement>) => {};

  return (
    <ColorPickerModal isOpen={isOpen} color={color} onChangeComplete={onChangePicker} onClose={onClose}>
      <Grid alignItems="center" templateColumns="32px 1fr 56px">
        <Picker size="xs" variant="outline" onClick={onToggle}>
          <Swatch backgroundColor={color} />
        </Picker>
        <Color size="xs" value={parsed.color} onBlur={onBlurOpacity} onChange={onChangeInput} />
        <Opacity size="xs" value={parsed.alpha} onChange={onChangeOpacity} textAlign="center" />
      </Grid>
    </ColorPickerModal>
  );
}

const Picker = chakra(Button, {
  baseStyle: {
    py: "1",
    px: "1",
    borderRadius: "sm",
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

const Swatch = chakra(Box, {
  baseStyle: {
    width: "full",
    height: "full",

    borderWidth: 1,
    borderRadius: "sm",
    borderStyle: "solid",
    borderColor: "gray.300",
  },
});

const Color = chakra(Input, {
  baseStyle: {
    borderRadius: 0,
  },
});

const Opacity = chakra(Input, {
  baseStyle: {
    borderRadius: "sm",
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
