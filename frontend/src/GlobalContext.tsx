import { TradingContextProvider } from './contexts/TradingContext'
import { UserStocksProvider } from './contexts/UserStocksContext'
import { SelectedStockProvider } from './contexts/SelectedStockContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { PortfolioBalanceProvider } from './contexts/PortfolioInfoContext'
import { GraphContextProvider } from './contexts/GraphContext'

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <PortfolioBalanceProvider>
            <TradingContextProvider>
                <UserStocksProvider>
                    <SelectedStockProvider>
                        <GraphContextProvider>
                            <HistoryProvider>{children}</HistoryProvider>
                        </GraphContextProvider>
                    </SelectedStockProvider>
                </UserStocksProvider>
            </TradingContextProvider>
        </PortfolioBalanceProvider>
    )
}
