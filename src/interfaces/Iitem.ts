export interface Item {
  id: number;
  titleItem: string;
  description: string | null;
  startDate: Date | null;
  finalDate: Date | null;
  order: number;
  listId: number;
}
