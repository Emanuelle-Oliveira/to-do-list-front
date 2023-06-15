import { Card, CardContent, IconButton, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { CSSProperties } from 'react';
import { Item } from '../../interfaces/Iitem';
import ItemCard from '../ItemCard';
import { Formik } from 'formik';
import { createItem } from '../../services/item-service';
import AddIcon from '@mui/icons-material/Add';
import { useListContext } from '../../hooks/list-context';

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

  return (
    <Card style={{ width: '100%' }} variant='outlined' sx={{ borderRadius: '10px' }}>
      <CardContent style={style}>
        <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#706e6e', marginBottom: '10px' }}>
          {titleList}
        </Typography>
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
              }).then((data) => {
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
                  style={{ marginTop: '5px', width: '185px' }}
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
                  style={{ height: '40px', marginLeft: '8px', marginTop: '5px' }}
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
      </CardContent>
    </Card>
  );
}

