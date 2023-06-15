import { createItem } from '../../../services/item-service';
import { IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import { useListContext } from '../../../hooks/list-context';

interface AddItemProps {
  id: number;
  order: number;
}

export default function AddItem({ id, order }: AddItemProps) {

  const { lists, setLists } = useListContext();

  async function handleCreateItem(values: { titleItem: string }, actions: FormikHelpers<typeof values>) {
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
  }

  return (
    <Formik
      initialValues={{
        titleItem: '',
      }}
      onSubmit={async (values, actions) => {
        await handleCreateItem(values, actions);
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