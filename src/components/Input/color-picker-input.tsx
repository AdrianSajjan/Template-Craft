import _ from "lodash";
import { ColorResult } from "react-color";
import { observer } from "mobx-react-lite";
import { ChangeEvent, useMemo, useState } from "react";
import { Grid, Input, chakra, Button, Box, useDisclosure, InputGroup, Text, InputRightElement } from "@chakra-ui/react";

import { ColorPickerModal } from "~/components/Modal";
import { convertAlphaDecimalToHex, convertAlphaPercentageToHex, isValidHexColor, extractAlphaAndBaseFromHex } from "~/lib/colors";

interface ColorPickerProps {
  value?: string;
  offsetX?: number;
  isDisabled?: boolean;
  onlyChangeOnBlur?: boolean;
  size?: "sm" | "md" | "lg" | "xs";
  onChange?: (color: string) => void;
}

function ColorPickerInput({ value = "#FFFFFF", size = "xs", offsetX, onlyChangeOnBlur, isDisabled, onChange }: ColorPickerProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const _input = value.length === 9 ? value.substring(0, 7) : value;

  const [color, setColor] = useState(value);
  const [input, setInput] = useState(_input);

  const parsed = useMemo(() => {
    const { alphaAsPercentage, base } = extractAlphaAndBaseFromHex(color);
    return {
      color: base,
      alpha: +alphaAsPercentage.toFixed(0),
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
    const value = +event.target.value;
    const opacity = _.clamp(value, 0, 100);
    const alpha = convertAlphaPercentageToHex(opacity);
    const result = parsed.color + alpha;
    setColor(result);
    if (onlyChangeOnBlur || !onChange) return;
    onChange(result);
  };

  const onBlurOpacity = () => {
    onChange?.(color);
  };

  const templateColumns = size === "xs" ? "36px auto 48px" : "40px auto 60px";

  return (
    <ColorPickerModal isOpen={isOpen} color={color} offsetX={offsetX} onChangeComplete={onChangePicker} onClose={onClose}>
      <Grid alignItems="center" width="full" templateColumns={templateColumns}>
        <Picker size={size} variant="outline" onClick={onToggle} isDisabled={isDisabled}>
          <Swatch backgroundColor={color} />
        </Picker>
        <Color size={size} value={input} onBlur={onBlurInput} onChange={onChangeInput} isDisabled={isDisabled} />
        <InputGroup size={size}>
          <Opacity type="number" min={0} max={100} value={parsed.alpha} onChange={onChangeOpacity} onBlur={onBlurOpacity} isDisabled={isDisabled} />
          <InputRightElement pointerEvents="none">
            <Text fontWeight={500} color={isDisabled ? "gray.300" : "gray.500"}>
              %
            </Text>
          </InputRightElement>
        </InputGroup>
      </Grid>
    </ColorPickerModal>
  );
}

export default observer(ColorPickerInput);

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
