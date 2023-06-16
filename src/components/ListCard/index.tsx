import { Card, CardContent, IconButton, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { CSSProperties, useState } from 'react';
import { Item } from '../../interfaces/Iitem';
import ItemCard from '../ItemCard';
import { useListContext } from '../../hooks/list-context';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import Box from '@mui/material/Box';
import { deleteList, updateList } from '../../services/list-service';
import ConfirmationDialog from '../common/ConfirmationDialog';
import AddItem from './AddItem';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { updateOrderItem } from '../../services/item-service';
import { reorderItems } from '../../utils/reorder-items';
import { CSS } from '@dnd-kit/utilities';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  const [openDelete, setOpenDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(titleList);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    await updateList(id, title)
      .then((response) => {
        return response;
      })
      .then((data) => {
        //console.log(data.data);
        setLists((prevLists) => prevLists.map(list => {
          if (list.id === id) {
            return { ...list, titleList: data.data.titleList };
          }
          return list;
        }));
      });
    setIsEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

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

  async function handleDragEnd(event: DragEndEvent) {
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: order + 1 });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    height: '200px',
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
        >
          <Card style={cardStyle} variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>

              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>

                {isEditing ? (
                  <>
                    <TextField
                      value={title}
                      onChange={handleChange}
                      size='small'
                      style={{ height: '40px', width: '165px' }}
                      inputProps={{ style: { fontSize: '12px' } }}
                      InputLabelProps={{ style: { fontSize: '12px' } }}
                    />
                    <IconButton
                      style={{ height: '40px', marginLeft: '2px', marginRight: '5px' }}
                      sx={{ color: '#ff700a' }}
                      size='small'
                      onClick={handleSaveClick}
                    >
                      <CheckCircleIcon fontSize='small' sx={{ color: '#ff700a' }} />
                    </IconButton>
                  </>
                ) : (
                  <Typography
                    sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#706e6e', flexGrow: 1 }}
                    onClick={handleEditClick}
                  >
                    {titleList}
                  </Typography>
                )}
                <IconButton
                  size='small'
                  onClick={handleClickOpenDelete}
                  sx={{ alignSelf: 'self-start', marginRight: '5px' }}
                >
                  <PlaylistRemoveIcon fontSize='small' />
                </IconButton>
              </Box>
              <SortableContext
                items={items?.map(item => item.order + 1) || []}
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
        </div>
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

