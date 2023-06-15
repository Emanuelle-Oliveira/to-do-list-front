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
import { useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import { Formik } from 'formik';
import { deleteItem, updateItem } from '../../services/item-service';
import { useListContext } from '../../hooks/list-context';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { lists, setLists } = useListContext();

  const [startOnDate, setStartOnDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());


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

  async function handleDelete() {
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

      <Dialog open={openUpdate} onClose={handleCloseUpdate} maxWidth='md'>
        <Formik
          initialValues={{
            titleItem: titleItem,
            description: description,
            startDate: startDate,
            finalDate: finalDate,
          }}
          onSubmit={async (values, actions) => {
            const dto = {
              titleItem: values.titleItem,
              description: values.description,
            };
            updateItem(id, dto)
              .then((response) => {
                return response;
              }).then((data) => {
              setLists((prevLists) => {
                return prevLists.map((list) => {
                  if (list.id === listId) {
                    return {
                      ...list,
                      items: list.items?.map((item) => {
                        if (item.id === id) {
                          return { ...item, ...data.data };
                        } else {
                          return item;
                        }
                      }),
                    };
                  } else {
                    return list;
                  }
                });
              });
            });
            actions.resetForm();
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => {
            return (
              <>
                <DialogContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                    <TextField
                      sx={{ width: '500px', marginBottom: '10px', marginTop: '10px' }}
                      label='Título'
                      variant='outlined'
                      size='small'
                      value={values.titleItem}
                      onChange={(value) => {
                        setFieldValue('titleItem', value.target.value);
                      }}
                    />
                    <TextField
                      label='Descrição'
                      multiline
                      rows={4}
                      fullWidth
                      sx={{ width: '500px', marginBottom: '10px' }}
                      value={values.description}
                      onChange={(value) => {
                        setFieldValue('description', value.target.value);
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Data inicial'
                          sx={{ width: '240px' }}
                          //value={values.startDate}
                          /*onChange={(value) => {
                            setFieldValue('titleItem', value.target.value);
                          }}*/
                        />
                        <DatePicker
                          label='Data final'
                          sx={{ width: '240px' }}
                          //value={values.finalDate}
                        />
                      </LocalizationProvider>
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker slots={{ field: SingleInputDateRangeField }} />
                      </LocalizationProvider>*/}
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseUpdate}>Cancelar</Button>
                  <Button
                    onClick={() => {
                      console.log('submetido');
                      handleSubmit();
                      handleCloseUpdate();
                    }}
                  >
                    Salvar
                  </Button>
                </DialogActions>
              </>
            );
          }}
        </Formik>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth='sm'
      >
        <DialogTitle>
          {'Tem certeza que deseja deletar esse item?'}
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
            {titleItem}
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