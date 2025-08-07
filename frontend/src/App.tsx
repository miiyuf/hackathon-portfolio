import { useState } from 'react'
import Sidebar from './components/Sidebar'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Market from './pages/Market'
import TradingAction from './components/TradingAction'
import History from './pages/History'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { CurrentPricesProvider } from './contexts/CurrentPricesContext';

// Google Fontsをインポート
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/700.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CBA135', 
      light: '#D4B04A',
      dark: '#B08A20',
      contrastText: '#F4F1E8',
    },
    secondary: {
      main: '#1B263B',
      light: '#2D3951',
      dark: '#141B29',
      contrastText: '#F4F1E8',
    },
    background: {
      default: '#0D1B2A',
      paper: '#141F2E',
    },
    text: {
      primary: '#F4F1E8',
      secondary: '#BDB9AF',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#FFD700', 
    },
    info: {
      main: '#778DA9', 
    },
    success: {
      main: '#64A36F',
    },
    sidebar: {
      main: '#0A1622',
      contrastText: '#F4F1E8',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0D1B2A',
          color: '#F4F1E8',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0A1622 0%, #1B263B 100%)',
          color: '#F4F1E8',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(244, 241, 232, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#141F2E',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #CBA135 30%, #E3B236 90%)',
          boxShadow: '0 3px 6px rgba(203, 161, 53, 0.3)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1B263B',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Montserrat, "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
    button: {
      fontWeight: 600,
    },
  },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CurrentPricesProvider>
                <div className="flex">
                    <Sidebar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/market" element={<Market />} />
                    </Routes>
                    <TradingAction />
                </div>
            </CurrentPricesProvider>
        </ThemeProvider>
    );
}

export default App
