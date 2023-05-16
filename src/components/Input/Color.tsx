import { Grid, Input, chakra, Button, Box } from "@chakra-ui/react";

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Grid alignItems="center" templateColumns="32px 1fr 56px">
      <Picker size="xs" variant="outline">
        <Swatch backgroundColor="#FFFFFF" />
      </Picker>
      <Color size="xs" value="#FFFFFF" />
      <Opacity size="xs" value="100%" textAlign="center" />
    </Grid>
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
