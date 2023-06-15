import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { CSSProperties } from 'react';
import { Item } from '../../interfaces/Iitem';
import ItemCard from '../ItemCard';
import { Formik } from 'formik';
import { createItem } from '../../services/item-service';
import AddIcon from '@mui/icons-material/Add';
import { useListContext } from '../../hooks/list-context';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import Box from '@mui/material/Box';
import { deleteList } from '../../services/list-service';

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

  async function handleDelete() {
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
          <Formik
            initialValues={{
              titleItem: '',
            }}
            onSubmit={async (values, actions) => {
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
            }}>
            {({ values, handleSubmit, setFieldValue }) => {
              return (
                <>
                  <TextField
                    style={{ marginTop: '5px', width: '194px' }}
                    inputProps={{ style: { fontSize: '12px' } }}
                    InputLabelProps={{ style: { fontSize: '12px' } }}
                    label='Adicionar item'
                    variant='outlined'
                    size='small'
                    value={values.titleItem}
                    onChange={(value) => {
                      setFieldValue('titleItem', value.target.value);
                    }}
                  />
                  <IconButton
                    style={{ height: '40px', marginLeft: '5px' }}
                    sx={{ color: '#ff700a' }}
                    onClick={() => {
                      console.log('submetido');
                      handleSubmit();
                    }}
                  >
                    <AddIcon fontSize='small' sx={{ color: '#ff700a' }} />
                  </IconButton>
                </>
              );
            }}
          </Formik>
        </CardContent>
      </Card>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth='sm'
      >
        <DialogTitle>
          {'Tem certeza que deseja deletar essa lista?'}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: 'monospace',
              color: '#706e6e',
              fontSize: '12px',
              flexGrow: 1,
              maxWidth: '180px',
            }}>
            {titleList}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={() => {
            console.log('submetido');
            handleDelete();
            handleCloseDelete();
          }}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

