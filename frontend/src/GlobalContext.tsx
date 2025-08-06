import { TradingContextProvider } from './contexts/TradingContext'
import { UserStocksProvider } from './contexts/UserStocksContext'
import { SelectedStockProvider } from './contexts/SelectedStockContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { PortfolioBalanceProvider } from './contexts/PortfolioBalanceContext'

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <PortfolioBalanceProvider>
            <TradingContextProvider>
                <UserStocksProvider>
                    <SelectedStockProvider>
                        <HistoryProvider>{children}</HistoryProvider>
                    </SelectedStockProvider>
                </UserStocksProvider>
            </TradingContextProvider>
        </PortfolioBalanceProvider>
    )
}
