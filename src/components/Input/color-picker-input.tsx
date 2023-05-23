import { Grid, Input, chakra, Button, Box, useDisclosure } from "@chakra-ui/react";
import { ColorPickerModal } from "@zocket/components/Modal";
import { convertAlphaDecimalToHex, convertAlphaPercentageToHex, convertHexToAlphaPercentage, isValidHexColor } from "@zocket/lib/colors";
import { ChangeEvent, useMemo, useState } from "react";
import { ColorResult } from "react-color";

interface ColorPickerProps {
  value?: string;
  onlyChangeOnBlur?: boolean;
  onChange?: (color: string) => void;
}

export default function ColorPickerInput({ value = "#FFFFFF", onlyChangeOnBlur, onChange }: ColorPickerProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const _input = value.length === 9 ? value.substring(0, 7) : value;

  const [color, setColor] = useState(value);
  const [input, setInput] = useState(_input);

  const parsed = useMemo(() => {
    const alpha = color.length === 9 ? color.substring(7) : "FF";
    const base = color.length === 9 ? color.substring(0, 7) : color;
    return {
      color: base,
      alpha: +convertHexToAlphaPercentage(alpha).toFixed(0),
    };
  }, [color]);

  const onChangePicker = (color: ColorResult) => {
    const hex = color.hex.toUpperCase();
    const opacity = color.rgb.a !== undefined ? convertAlphaDecimalToHex(color.rgb.a) : "FF";
    const result = hex + opacity;
    setColor(result);
    setInput(hex);
    if (!onChange) return;
    onChange(result);
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const hex = event.target.value;
    const valid = isValidHexColor(hex);
    const result = hex + convertAlphaPercentageToHex(parsed.alpha);
    setInput(hex);
    if (!valid) return;
    setColor(result);
    if (onlyChangeOnBlur || !onChange) return;
    onChange(result);
  };

  const onBlurInput = () => {
    onChange?.(color);
  };

  const onChangeOpacity = (event: ChangeEvent<HTMLInputElement>) => {
    const opacity = +event.target.value;
    const alpha = convertAlphaPercentageToHex(opacity);
    const result = parsed.color + alpha;
    setColor(result);
    if (onlyChangeOnBlur || !onChange) return;
    onChange(result);
  };

  const onBlurOpacity = () => {
    onChange?.(color);
  };

  return (
    <ColorPickerModal isOpen={isOpen} color={color} onChangeComplete={onChangePicker} onClose={onClose}>
      <Grid alignItems="center" templateColumns="32px 1fr 56px">
        <Picker size="xs" variant="outline" onClick={onToggle}>
          <Swatch backgroundColor={color} />
        </Picker>
        <Color size="xs" value={input} onBlur={onBlurInput} onChange={onChangeInput} />
        <Opacity size="xs" type="number" value={parsed.alpha} onChange={onChangeOpacity} onBlur={onBlurOpacity} textAlign="center" />
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
