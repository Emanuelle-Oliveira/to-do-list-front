import { FormikHelpers } from 'formik';
import { createItem } from '../../services/item-service';
import { List } from '../../interfaces/Ilist';
import React from 'react';

export default async function handleCreateItem(
  values: { titleItem: string },
  actions: FormikHelpers<typeof values>,
  id: number,
  order: number,
  lists: List[],
  setLists: React.Dispatch<React.SetStateAction<List[]>>,
) {

  const dto = {
    titleItem: values.titleItem,
    listId: id,
  };
  createItem(dto)
    .then((response) => {
      return response;
    })
    .then((data) => {
      const updatedLists = [...lists];

      if (updatedLists[order] && updatedLists[order].items) {
        updatedLists[order].items?.push(data.data);
      }
      setLists(updatedLists);
    });
  actions.resetForm();
}