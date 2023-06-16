import { deleteList } from '../services/list-service';
import React from 'react';
import { List } from '../interfaces/Ilist';

export default async function handleDeleteList(id: number, setLists: React.Dispatch<React.SetStateAction<List[]>>) {
  await deleteList(id)
    .then((response) => {
      return response;
    }).then((data) => {
      //console.log(data.data);
      setLists((prevLists) => {
        return prevLists
          .filter((list) => list.id !== data.data.id)
          .map((list) => {
            if (list.order > data.data.order) {
              return { ...list, order: list.order - 1 };
            }
            return list;
          });
      });
    });
}