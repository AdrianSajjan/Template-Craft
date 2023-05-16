import { FabricTemplate } from "@zocket/interfaces/app";
import * as uuid from "uuid";

export const templates: Array<FabricTemplate> = [
  {
    index: "1",
    source: "/templates/video/template-2.webp",
    background: "image",
    state: [
      {
        name: uuid.v4(),
        type: "textbox",
        value: "Template 1",
        details: { top: 914.3, left: 314.5, width: 449, fill: "#FFFFFF", fontFamily: "Poppins Black", fontSize: 80 },
      },
    ],
  },
];
