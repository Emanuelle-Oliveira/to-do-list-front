import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

/*export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});*/

// ARRUMAR
const theme = createTheme({
    palette: {
      primary: {
        main: '#ff700a',
      },
      secondary: {
        main: '#19857b',
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      fontFamily: 'monospace',
    },
  },
);

export default theme;
