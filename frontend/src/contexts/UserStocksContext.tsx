import { createContext, useReducer, useContext, useEffect } from 'react'
import { fetchPortfolioData } from '../api/stocks'
import { useTradingContext } from './TradingContext'

export interface UserStockState {
    id: number
    ticker: string
    stockName: string
    qty: number
    costPrice: number
    currentPrice: number
    profitLoss: number
}

interface UserStocksContextType {
    userStocksState: UserStockState[]
    userStocksDispatch: React.Dispatch<{
        type: string
        state?: UserStockState[]
    }>
}

const initUserStocksState: UserStockState[] = []

const initUserStocksContext: UserStocksContextType = {
    userStocksState: initUserStocksState,
    userStocksDispatch: () => {},
}

const UserStocksContext = createContext<UserStocksContextType>(
    initUserStocksContext
)

function userStocksReducer(
    state: UserStockState[],
    action: { type: string; state?: UserStockState[] }
): UserStockState[] {
    switch (action.type) {
        case 'INIT_STOCK':
            return action.state ? [...action.state] : state
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}

export function useUserStocksContext() {
    return useContext(UserStocksContext)
}

export function UserStocksProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [userStocksState, userStocksDispatch] = useReducer(
        userStocksReducer,
        initUserStocksState
    )

    const { tradingModalState, tradingModalDispatch } = useTradingContext()

    useEffect(() => {
        const testFetch = async () => {
            try {
                const data = await fetchPortfolioData()
                console.log('Global context portfolio data:', data)
                const portfolioData: UserStockState[] = data.map(
                    (holding, i) => {
                        return {
                            id: i,
                            ticker: holding.symbol,
                            stockName: holding.name || 'N/A',
                            qty: holding.total_quantity,
                            costPrice: holding.purchase_price,
                            currentPrice: holding.current_price,
                            profitLoss: holding.profit_loss,
                        }
                    }
                )
                userStocksDispatch({ type: 'INIT_STOCK', state: portfolioData })
            } catch (error) {
                console.error('Error fetching portfolio data:', error)
            }
        }
        testFetch()
    }, [tradingModalState.isOpen])

    return (
        <UserStocksContext.Provider
            value={{ userStocksState, userStocksDispatch }}
        >
            {children}
        </UserStocksContext.Provider>
    )
}
