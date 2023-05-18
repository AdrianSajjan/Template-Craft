import { Template } from "@zocket/interfaces/template";
import { objectID } from "@zocket/lib/nanoid";

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
        details: { top: 450, left: 400, width: 380, fill: "#FFFFFF", fontFamily: "Poppins Black", fontSize: 64 },
      },
    ],
  },
];

// const onOpenImageExplorer = () => {
//   if (!image.current) return;
//   image.current.click();
// };

// const onFileInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
//   const element = event.target as HTMLInputElement;
//   element.value = "";
// };

// const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//   if (!event.target.files) return;
//   const file = event.target.files[0];
//   const url = URL.createObjectURL(file);
//   // onAddImage(url);
// };
