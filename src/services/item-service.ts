import { CreateItemDto, Item } from '../interfaces/Iitem';
import { http } from './http';

export const createItem = async (
  dto: CreateItemDto,
) => {
  return http.post<Item>('/item', {
    ...dto,
  });
};