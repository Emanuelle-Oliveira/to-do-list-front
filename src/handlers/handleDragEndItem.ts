import { DragEndEvent } from '@dnd-kit/core';
import { updateOrderItem } from '../services/item-service';
import { reorderItems } from '../utils/reorder-items';
import { List } from '../interfaces/Ilist';
import React from 'react';
import { Item } from '../interfaces/Iitem';

export default async function handleDragEndItem(
  event: DragEndEvent,
  id: number,
  setLists: React.Dispatch<React.SetStateAction<List[]>>,
  items?: Item[] | null,
) {
  console.log('drag end called');
  const { active, over } = event;
  console.log(active.id, over?.id);

  if (over && items) {
    if (active.id !== over.id) {

      const draggedItem = items?.find(item => item.order === (Number(active.id) - 1));
      const itemId = draggedItem?.id;

      const dto = {
        currentOrder: Number(active.id) - 1,
        targetOrder: Number(over.id) - 1,
        currentListId: id,
        targetListId: id,
      };
      await updateOrderItem(Number(itemId), dto)
        .then((response) => {
          return response;
        })
        .then((data) => {
          const reorderedItems = reorderItems(items, dto.currentOrder, dto.targetOrder);
          setLists(prevLists => {
            return prevLists.map(list => {
              if (list.id === id) {
                return { ...list, items: reorderedItems };
              }
              return list;
            });
          });
        });
    }
  }
}