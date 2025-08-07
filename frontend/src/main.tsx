import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GlobalProvider } from './GlobalContext.js'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CurrentPricesProvider } from './contexts/CurrentPricesContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalProvider>
            <CurrentPricesProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
            </CurrentPricesProvider>
        </GlobalProvider>
    </StrictMode>
)
