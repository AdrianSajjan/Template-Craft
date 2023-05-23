import * as React from "react";
import { SketchPicker, Color, ColorChangeHandler } from "react-color";
import { CloseButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverProps, PopoverTrigger, Text } from "@chakra-ui/react";

interface ColorPickerModalProps extends PopoverProps {
  color?: Color;
  children?: React.ReactNode;
  onChangeComplete?: ColorChangeHandler;
}

export default function ColorPickerModal({ children, isOpen, color, onClose, onChangeComplete }: ColorPickerModalProps) {
  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="left" closeOnBlur={false} offset={[102, 125]}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent width="min-content">
        <PopoverHeader display="flex" pr={2} pl={4} alignItems="center" justifyContent="space-between">
          <Text fontSize="sm" fontWeight={600}>
            Pick Color
          </Text>
          <CloseButton size="md" fontSize={10} onClick={onClose} />
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody px="0" pt="0">
          <SketchPicker onChangeComplete={onChangeComplete} color={color} styles={picker} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const picker = {
  default: {
    picker: {
      fontFamily: `"Inter", sans-serif`,
      boxShadow: "none",
      width: 250,
    },
  },
};
