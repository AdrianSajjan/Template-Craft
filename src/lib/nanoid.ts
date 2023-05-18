import { customAlphabet } from "nanoid";

const nanoid_object = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 3);

type Prefix = "text" | "image" | "rect" | "frame" | (string & {});

export const objectID = (prefix: Prefix) => prefix + "_" + nanoid_object();
