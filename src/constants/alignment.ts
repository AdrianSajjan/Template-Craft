import { AlignCenterVerticalIcon } from "lucide-react";
import { AlignCenterHorizontalIcon, LayoutGridIcon } from "lucide-react";
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

export const textAlignments = [
  {
    name: "Left Align",
    value: "left",
    icon: AlignLeftIcon,
  },
  {
    name: "Center Align",
    value: "center",
    icon: AlignCenterIcon,
  },
  {
    name: "Right Align",
    value: "right",
    icon: AlignRightIcon,
  },
  {
    name: "Justify Align",
    value: "justify",
    icon: AlignJustifyIcon,
  },
] as const;

export const viewportAlignment = [
  {
    name: "Absolute Center",
    icon: LayoutGridIcon,
    value: "center",
  },
  {
    name: "Horizontal Center",
    icon: AlignCenterHorizontalIcon,
    value: "horizontal",
  },
  {
    name: "Vertical Center",
    icon: AlignCenterVerticalIcon,
    value: "vertical",
  },
] as const;
