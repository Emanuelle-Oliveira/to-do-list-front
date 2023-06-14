import * as React from 'react';
import { useEffect, useState } from 'react';
import { getAllList } from '../src/services/list-service';
import { List } from '../src/interfaces/Ilist';
import ListCard from '../src/components/List';
import { Container, Grid } from '@mui/material';
import Navbar from '../src/components/Navbar';

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    getAllList()
      .then((response) => {
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
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={4}
          justifySelf='center'
        >
          {lists.map((list) => (
            <Grid item key={list.id} xs={12} sm={6} md={4}>
              <ListCard
                key={list.id}
                id={list.id}
                titleList={list.titleList}
                order={list.order}
                items={list.items}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
