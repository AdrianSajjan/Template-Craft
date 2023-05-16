import { InputGroup, InputLeftElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";

interface PropertyInputProps {
  label?: string;
  value?: number;
  onChange?: (_: number) => void;
}

export default function PropertyInput({ label, value, onChange }: PropertyInputProps) {
  return (
    <InputGroup size="xs">
      <InputLeftElement pointerEvents="none">
        <Text fontWeight={500} color="gray.400">
          {label}
        </Text>
      </InputLeftElement>
      <NumberInput>
        <NumberInputField pl="6" />
        <NumberInputStepper>
          <NumberIncrementStepper color="gray.400" fontSize={8} />
          <NumberDecrementStepper color="gray.400" fontSize={8} />
        </NumberInputStepper>
      </NumberInput>
    </InputGroup>
  );
}
