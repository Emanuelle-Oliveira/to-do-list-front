import { Card, CardContent, Typography } from '@mui/material';
import { CSSProperties } from 'react';
import { Item } from '../../interfaces/Iitem';

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
  return (
    <Card style={{ width: '100%' }} variant='outlined' sx={{ borderRadius: '10px' }}>
      <CardContent style={style}>
        <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#706e6e' }}>
          {titleList}
        </Typography>
        <ul>
          {items?.map((item) => (
            <li key={item.id}>
              {item.titleItem}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

