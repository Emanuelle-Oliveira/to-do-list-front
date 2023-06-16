import { Formik } from 'formik';
import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';
import { useListContext } from '../../../hooks/list-context';
import handleUpdateItem from '../../../handlers/handleUpdateItem';

interface UpdateDialogProps {
  handleClose: () => void;
  open: boolean;
  id: number;
  titleItem: string;
  description: string | null;
  startDate: Date | null;
  finalDate: Date | null;
  listId: number;
}

export default function UpdateDialog({
  handleClose,
  open,
  id,
  titleItem,
  description,
  startDate,
  finalDate,
  listId,
}: UpdateDialogProps) {
  const { lists, setLists } = useListContext();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md'>
      <Formik
        initialValues={{
          titleItem: titleItem,
          description: description,
          startDate: startDate,
          finalDate: finalDate,
        }}
        onSubmit={async (values, actions) => {
          await handleUpdateItem(values, actions, id, listId, setLists);
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
                <Button onClick={handleClose}>Cancelar</Button>
                <Button
                  onClick={() => {
                    console.log('submetido');
                    handleSubmit();
                    handleClose();
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
  );
}