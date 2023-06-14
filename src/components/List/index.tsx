import { Card, CardContent } from '@mui/material';
import { List } from '../../interfaces/Ilist';

export default function ListCard({ id, titleList, order, items }: List) {
  return (
    <Card>
      <CardContent>
        {titleList}
      </CardContent>
    </Card>
  );
}
