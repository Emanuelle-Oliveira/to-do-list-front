import { Card, CardContent, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { CSSProperties } from 'react';
import { Item } from '../../interfaces/Iitem';
import ItemCard from '../ItemCard';
import { useListContext } from '../../hooks/list-context';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import Box from '@mui/material/Box';
import { deleteList } from '../../services/list-service';
import ConfirmationDialog from '../common/ConfirmationDialog';
import AddItem from './AddItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { updateOrderItem } from '../../services/item-service';
import { reorderItems } from '../../utils/reorder-items';

interface ListCardProps {
  id: number;
  titleList: string;
  order: number;
  items?: Item[] | null;
}

const cardStyle: CSSProperties = {
  width: '100%',
  maxHeight: 'calc(96vh - 96px)',
  overflowY: 'auto',
};

export default function ListCard({ id, titleList, order, items }: ListCardProps) {
  const { lists, setLists } = useListContext();
  const [openDelete, setOpenDelete] = React.useState(false);
  //const [itemsState, setItemsStates] = useState(items);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  async function handleDeleteList() {
    await deleteList(id)
      .then((response) => {
        return response;
      }).then((data) => {
        console.log(data.data);
        setLists((prevLists) => {
          return prevLists.filter((list) => list.id !== data.data.id);
        });
      });
  }

  async function handleDragEnd(event: DragEndEvent) {
    console.log('drag end called');
    const { active, over } = event;
    console.log(active.id, over?.id);
    if (over && items) {
      if (active.id !== over.id) {

        const draggedItem = items?.find(item => item.order === active.id);
        const itemId = draggedItem?.id;

        const dto = {
          currentOrder: Number(active.id),
          targetOrder: Number(over.id),
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

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Card style={cardStyle} variant='outlined' sx={{ borderRadius: '10px' }}>
          <CardContent>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <Typography
                sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#706e6e', flexGrow: 1 }}>
                {titleList}
              </Typography>
              <IconButton
                size='small'
                onClick={handleClickOpenDelete}
                sx={{ alignSelf: 'self-start', marginRight: '5px' }}
              >
                <PlaylistRemoveIcon fontSize='small' />
              </IconButton>
            </Box>
            <SortableContext
              items={items?.map(item => item.order) || []}
              strategy={verticalListSortingStrategy}
            >
              {items?.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  titleItem={item.titleItem}
                  description={item.description}
                  startDate={item.startDate}
                  finalDate={item.finalDate}
                  order={item.order}
                  listId={item.listId}
                />
              ))}
            </SortableContext>
            <AddItem
              id={id}
              order={order}
            />
          </CardContent>
        </Card>
      </DndContext>
      <ConfirmationDialog
        handleDelete={handleDeleteList}
        handleClose={handleCloseDelete}
        open={openDelete}
        message='Tem certeza que deseja deletar essa lista?'
        title={titleList}
      />
    </>
  );
}

