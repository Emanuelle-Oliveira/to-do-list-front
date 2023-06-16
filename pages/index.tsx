import * as React from 'react';
import { useEffect } from 'react';
import { getAllList, updateOrderList } from '../src/services/list-service';
import { List } from '../src/interfaces/Ilist';
import ListCard from '../src/components/ListCard';
import { Grid } from '@mui/material';
import Navbar from '../src/components/Navbar';
import { useListContext } from '../src/hooks/list-context';
import AddList from '../src/components/AddList';
import Box from '@mui/material/Box';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { reorderLists } from '../src/utils/reorder-lists';

export default function Home() {
  const { lists, setLists } = useListContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );


  useEffect(() => {
    getAllList()
      .then((response) => {
        return response;
      })
      .then((data) => {
        const receivedLists: List[] = [];
        for (let i = 0; i < data.length; i++) {
          const list: List = {
            ...data[i],
          };
          receivedLists.push(list);
        }
        setLists(receivedLists);
      });
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    console.log('drag end called');
    const { active, over } = event;
    console.log(active.id, over?.id);
    if (over) {
      if (active.id !== over.id) {
        const draggedList = lists.find(list => list.order === (Number(active.id) - 1));
        const id = draggedList?.id;

        const dto = {
          currentOrder: Number(active.id) - 1,
          targetOrder: Number(over.id) - 1,
        };

        await updateOrderList(Number(id), dto)
          .then((response) => {
            return response;
          })
          .then((data) => {
            //console.log(data.data);
            const reorderedLists = reorderLists(lists, dto.currentOrder, dto.targetOrder);
            setLists(reorderedLists);
          });
      }
    }
  }

  return (
    <>
      <Navbar />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Box
          style={{
            overflowX: 'auto',
            padding: '20px',
            height: 'calc(104vh - 90px)',
            boxSizing: 'border-box',
          }}
        >
          <Grid container spacing={2} style={{ flexWrap: 'nowrap' }}>
            {lists.map((list) => (
              <Grid item key={list.id} style={{ display: 'inline-flex', minWidth: '300px', alignSelf: 'flex-start' }}>
                <SortableContext
                  items={lists.map(list => list.order + 1) || []}
                  strategy={horizontalListSortingStrategy}
                >
                  <ListCard
                    id={list.id}
                    titleList={list.titleList}
                    order={list.order}
                    items={list.items}
                  />
                </SortableContext>
              </Grid>
            ))}
            <Grid item style={{ display: 'inline-flex', minWidth: '300px' }}>
              <AddList />
            </Grid>
          </Grid>
        </Box>
      </DndContext>
    </>
  );
}