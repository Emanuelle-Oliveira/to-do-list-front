export interface Item {
  id: number;
  titleItem: string;
  description: string | null;
  startDate: Date | null;
  finalDate: Date | null;
  order: number;
  listId: number;
}

export interface CreateItemDto {
  titleItem: string;
  listId: number;
}

export interface UpdateItemDto {
  titleItem?: string | null;
  description?: string | null;
  startDate?: Date | null;
  finalDate?: Date | null;
}

export interface UpdateOrderItemDto {
  currentOrder: number,
  targetOrder: number,
  currentListId: number,
  targetListId: number,
}