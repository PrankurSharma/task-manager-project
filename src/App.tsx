import './App.css';
import { ContextProvider } from './context/AppContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, Drawer, ThemeProvider, useMediaQuery } from '@mui/material';
import RootModal from './ui/RootModal';
import Routes from './Routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import Alert from './ui/Alert';
import RootDrawer from './ui/RootDrawer';


function App() {

  const theme = createTheme({
    typography: {
      fontFamily: "'Mulish'"
    }
  });

  const isMobile = useMediaQuery(theme.breakpoints.down(768));


  return (
    <>
        <ContextProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
              {!isMobile ? <RootModal /> : <RootDrawer />}
              <Alert />
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </ThemeProvider>
          </LocalizationProvider>
        </ContextProvider>
    </>
  )
}

export default App
