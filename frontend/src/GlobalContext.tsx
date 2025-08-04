import { createContext, useReducer, useContext, useEffect } from 'react'
import { TradingContextProvider } from './contexts/TradingContext'
import { UserStocksProvider } from './contexts/UserStocksContext'
import { SelectedStockProvider } from './contexts/SelectedStockContext'

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <TradingContextProvider>
            <UserStocksProvider>
                <SelectedStockProvider>{children}</SelectedStockProvider>
            </UserStocksProvider>
        </TradingContextProvider>
    )
}
