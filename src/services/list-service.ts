import { http } from './http';
import { List } from '../interfaces/Ilist';

export const getAllList = async () => {
  return http.get<List[]>('/list')
    .then((response): List[] => {
      return response.data;
    });
};

export const createList = async (
  titleList: string,
) => {
  return http.post<List>('/list', {
    titleList: titleList,
  });
};

