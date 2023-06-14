import { Card, CardContent, Typography } from '@mui/material';

interface ItemCardProps {
  id: number;
  titleItem: string;
  description: string | null;
  startDate: Date | null;
  finalDate: Date | null;
  order: number;
  listId: number;
}

export default function ItemCard({ id, titleItem, description, startDate, finalDate, order, listId }: ItemCardProps) {
  return (
    <Card variant='outlined' sx={{ borderRadius: '6px', marginBottom: '5px' }}>
      <CardContent sx={{ padding: '5px' }}>
        <Typography sx={{ fontFamily: 'monospace', color: '#706e6e', fontSize: '12px' }}>
          {titleItem}
        </Typography>
      </CardContent>
    </Card>
  );
}