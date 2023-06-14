import {Item} from "./Iitem";

export interface List {
  id: number;
  titleList: string;
  order: number;
  items?: Item[] | null;
}