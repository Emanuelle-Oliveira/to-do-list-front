import * as React from 'react';
import { useEffect } from 'react';
import { createList, getAllList } from '../src/services/list-service';
import { List } from '../src/interfaces/Ilist';
import ListCard from '../src/components/ListCard';
import { Grid, IconButton, TextField } from '@mui/material';
import Navbar from '../src/components/Navbar';
import AddIcon from '@mui/icons-material/Add';
import { Formik } from 'formik';
import { useListContext } from '../src/hooks/list-context';

export default function Home() {
  const { lists, setLists } = useListContext();

  useEffect(() => {
    getAllList()
      .then((response) => {
        console.log(response);
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

  return (
    <>
      <Navbar />
      <div
        style={{
          overflowX: 'auto',
          padding: '20px',
          height: 'calc(104vh - 90px)',
          boxSizing: 'border-box',
        }}
      >
        <Grid container spacing={2} style={{ flexWrap: 'nowrap' }}>
          {lists.map((list) => (
            <Grid item key={list.id} style={{ display: 'inline-flex', minWidth: '300px' }}>
              <ListCard
                id={list.id}
                titleList={list.titleList}
                order={list.order}
                items={list.items}
              />
            </Grid>
          ))}
          <Grid item style={{ display: 'inline-flex', minWidth: '300px' }}>
            <Formik
              initialValues={{ titleList: '' }}
              onSubmit={async (values, actions) => {
                console.log(values.titleList);
                createList(values.titleList)
                  .then((response) => {
                    return response;
                  }).then((data) => {
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
          </Grid>
        </Grid>
      </div>
    </>
  );
}

