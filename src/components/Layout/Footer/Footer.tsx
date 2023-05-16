import styled from "@emotion/styled";
import { Button, HStack, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";

interface FooterProps {
  scale?: number;
  canUndo?: boolean;
  canRedo?: boolean;
  handleUndo?: () => void;
  handleRedo?: () => void;
  onScaleChange?: (value: number) => void;
}

export default function Footer({ scale = 0.4, canRedo, canUndo, handleRedo, handleUndo, onScaleChange }: FooterProps) {
  return (
    <StyledFooter>
      <HStack ml="auto">
        <HStack spacing={2} mr={8}>
          <Button variant="ghost" fontWeight={600}>
            {Math.floor(scale * 100)}%
          </Button>
          <Slider value={scale} onChange={onScaleChange} min={0.1} step={0.01} max={2} aria-label="zoom" w={48} defaultValue={30}>
            <SliderTrack bgColor="#EEEEEE">
              <SliderFilledTrack bgColor="#AAAAAA" />
            </SliderTrack>
            <SliderThumb bgColor="#000000" />
          </Slider>
        </HStack>
        <Button variant="outline" isDisabled={!canUndo} onClick={handleUndo}>
          Undo
        </Button>
        <Button variant="outline" isDisabled={!canRedo} onClick={handleRedo}>
          Redo
        </Button>
      </HStack>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  height: 80px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-top: 1px solid #dddddd;
  background-color: #ffffff;
`;
