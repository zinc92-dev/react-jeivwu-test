import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { light: '#C7E6C7', main: '#328F35', dark: '#105F18' },
    secondary: { light: '#C4CAE4', main: '#32418F', dark: '#1E276C' },
    error: { light: '#FEECEB', main: '#F44336', dark: '#621B16' },
    warning: { light: '#FDF0E6', main: '#ED6C02', dark: '#5F2B01' },
    info: { light: '#E9F5FE', main: '#2196F3', dark: '#0D3C61' },
    success: { light: '#EDF7ED', main: '#4CAF50', dark: '#1E4620' },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1000,
      lg: 1200,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: ['Kanit', 'sans-serif'].join(','),
    color: '#333333',
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#25282B',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.375,
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.375,
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.375,
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.375,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.375,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.375,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});
