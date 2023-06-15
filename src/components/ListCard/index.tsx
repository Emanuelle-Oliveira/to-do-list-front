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

interface ListCardProps {
  id: number;
  titleList: string;
  order: number;
  items?: Item[] | null;
}

const style: CSSProperties = {
  maxHeight: 'calc(96vh - 96px)',
  overflowY: 'auto',
};

export default function ListCard({ id, titleList, order, items }: ListCardProps) {
  const { lists, setLists } = useListContext();
  const [openDelete, setOpenDelete] = React.useState(false);

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

  return (
    <>
      <Card style={{ width: '100%' }} variant='outlined' sx={{ borderRadius: '10px' }}>
        <CardContent style={style}>
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
          <AddItem
            id={id}
            order={order}
          />
        </CardContent>
      </Card>

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

