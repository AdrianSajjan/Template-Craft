import { Template } from "~/interfaces/template";
import { objectID } from "~/lib/nanoid";

export const templates: Array<Template> = [
  {
    id: "template-1",
    source: "#FFFFFF",
    background: "color",
    height: 1080,
    width: 1080,
    state: [
      {
        name: objectID("image"),
        type: "image",
        value: "https://g2.img-dpreview.com/2E3F787848C541C3BB196015762B1CFD.jpg",
        details: { top: 0, left: 0, height: 1080, width: 1080 },
      },
      {
        name: objectID("text"),
        type: "textbox",
        value: "Template 1",
        details: { top: 503, left: 360, width: 360, fill: "#FFFFFF", fontFamily: "Poppins Black", fontSize: 64 },
      },
    ],
  },
];
