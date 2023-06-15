import { Card, CardContent, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteItem } from '../../services/item-service';
import { useListContext } from '../../hooks/list-context';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmationDialog from '../common/ConfirmationDialog';
import UpdateDialog from './UpdateDialog';

interface ItemCardProps {
  id: number;
  titleItem: string;
  description: string | null;
  startDate: Date | null;
  finalDate: Date | null;
  order: number;
  listId: number;
}

export default function ItemCard({
  id,
  titleItem,
  description,
  startDate,
  finalDate,
  order,
  listId,
}: ItemCardProps) {

  const [openUpdate, setOpenUpdate] = React.useState<boolean>(false);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const { lists, setLists } = useListContext();

  //const [startOnDate, setStartOnDate] = useState<Date | null>(new Date());
  //const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleClickOpenUpdate = () => {
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  async function handleDeleteItem() {
    await deleteItem(id)
      .then((response) => {
        return response;
      }).then((data) => {
        setLists((prevLists) => {
          return prevLists.map((list) => {
            if (list.id === data.data.listId) {
              return {
                ...list,
                items: list.items?.filter((item) => item.id !== data.data.id),
              };
            } else {
              return list;
            }
          });
        });
      });
  }

  return (
    <>
      <Card variant='outlined' sx={{ borderRadius: '6px', marginBottom: '5px' }}>
        <CardContent sx={{ padding: '5px', display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: 'monospace',
              color: '#706e6e',
              fontSize: '12px',
              flexGrow: 1,
              maxWidth: '180px',
            }}>
            {titleItem}
          </Typography>
          <IconButton size='small' onClick={handleClickOpenUpdate} sx={{ alignSelf: 'self-start' }}>
            <ModeEditIcon fontSize='small' />
          </IconButton>
          <IconButton size='small' onClick={handleClickOpenDelete} sx={{ alignSelf: 'self-start' }}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </CardContent>
      </Card>

      <UpdateDialog
        handleClose={handleCloseUpdate}
        open={openUpdate}
        id={id}
        titleItem={titleItem}
        description={description}
        startDate={startDate}
        finalDate={finalDate}
        listId={listId}
      />

      <ConfirmationDialog
        handleDelete={handleDeleteItem}
        handleClose={handleCloseDelete}
        open={openDelete}
        message='Tem certeza que deseja deletar esse item?'
        title={titleItem}
      />
    </>
  );
}