import { TradingContextProvider } from './contexts/TradingContext'
import { UserStocksProvider } from './contexts/UserStocksContext'
import { SelectedStockProvider } from './contexts/SelectedStockContext'
import { HistoryProvider } from './contexts/HistoryContext'

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <TradingContextProvider>
            <UserStocksProvider>
                <SelectedStockProvider>
                    <HistoryProvider>{children}</HistoryProvider>
                </SelectedStockProvider>
            </UserStocksProvider>
        </TradingContextProvider>
    )
}
