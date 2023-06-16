import { createList } from '../../services/list-service';
import { IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Formik } from 'formik';
import * as React from 'react';
import { useListContext } from '../../hooks/list-context';

export default function AddList() {

  const { lists, setLists } = useListContext();

  return (
    <Formik
      initialValues={{ titleList: '' }}
      onSubmit={async (values, actions) => {
        //console.log(values.titleList);
        createList(values.titleList)
          .then((response) => {
            return response;
          })
          .then((data) => {
            setLists(prevLists => [...prevLists, { ...data.data, items: [] }]);
          });
        actions.resetForm();
      }}>
      {({ values, handleSubmit, setFieldValue }) => {
        return (
          <>
            <TextField
              style={{ marginTop: '2px' }}
              inputProps={{ style: { fontSize: '14px' } }}
              InputLabelProps={{ style: { fontSize: '14px' } }}
              id='outlined-basic'
              label='Adicionar lista'
              variant='outlined'
              size='small'
              value={values.titleList}
              onChange={(value) => {
                setFieldValue('titleList', value.target.value);
              }}
            />
            <IconButton
              style={{ height: '40px', marginLeft: '8px' }}
              sx={{ color: '#ff700a' }}
              onClick={() => {
                console.log('submetido');
                handleSubmit();
              }}
            >
              <AddIcon sx={{ color: '#ff700a' }} />
            </IconButton>
          </>
        );
      }}
    </Formik>
  );
}