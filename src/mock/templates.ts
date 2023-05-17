import { FabricTemplate } from "@zocket/interfaces/app";
import { nanoid } from "nanoid";

export const templates: Array<FabricTemplate> = [
  {
    index: "1",
    source: "#FFFFFF",
    background: "color",
    state: [
      {
        name: "image_" + nanoid(3),
        type: "image",
        value: "https://g2.img-dpreview.com/2E3F787848C541C3BB196015762B1CFD.jpg",
        details: { top: 0, left: 0, height: 1080, width: 1080 },
      },
      {
        name: "text_" + nanoid(3),
        type: "textbox",
        value: "Template 1",
        details: { top: 450, left: 400, width: 380, fill: "#FFFFFF", fontFamily: "Poppins Black", fontSize: 64 },
      },
    ],
  },
];
