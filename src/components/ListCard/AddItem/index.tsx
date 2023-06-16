import { IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Formik } from 'formik';
import * as React from 'react';
import { useListContext } from '../../../hooks/list-context';
import handleCreateItem from '../../../handlers/handleCreateItem';

interface AddItemProps {
  id: number;
  order: number;
}

export default function AddItem({ id, order }: AddItemProps) {
  const { lists, setLists } = useListContext();

  return (
    <Formik
      initialValues={{
        titleItem: '',
      }}
      onSubmit={async (values, actions) => {
        await handleCreateItem(values, actions, id, order, lists, setLists);
      }}
    >
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
  );
}