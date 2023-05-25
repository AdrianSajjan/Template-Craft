import { filter } from "~/constants/filter";

export type ImageFilterMap = Map<string, FilterMap>;

export type FilterMap = Map<FilterKeys, Filter>;

export type Filter = { index: number; type: string; [key: string]: string | number };

export type FilterKeys = keyof typeof filter.keys;
