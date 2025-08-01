import { createContext, useReducer, useContext, useEffect } from 'react'
import { fetchPortfolioData } from './api/stocks'
import { PortfolioData } from './api/stocks'

interface TradingModalState {
    isOpen: boolean
    symbol?: string
}

interface TradingModalContextType {
    tradingModalState: TradingModalState
    tradingModalDispatch: React.Dispatch<{
        type: string
        state?: TradingModalState
    }>
}

const initTradingModalContext: TradingModalContextType = {
    tradingModalState: {
        isOpen: false,
        symbol: '',
    },
    tradingModalDispatch: () => {},
}

const initTradingModalState: TradingModalState = {
    isOpen: false,
    symbol: '',
}

const TradingContext = createContext<TradingModalContextType>(
    initTradingModalContext
)

function tradingModalReducer(
    state: TradingModalState,
    action: { type: string; state?: TradingModalState }
) {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { ...state, isOpen: true }
        case 'CLOSE_MODAL':
            return { ...state, isOpen: false }
        case 'UPDATE_MODAL_SYMBOL':
            return { ...state, symbol: action.state?.symbol }
        case 'OPEN_MODAL_WITH_DATA':
            return { ...state, isOpen: true, symbol: action.state?.symbol }
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}

export interface UserStockState {
    id: number
    ticker: string
    stockName: string
    qty: number
    costPrice: number
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

export function useTradingContext() {
    return useContext(TradingContext)
}
export function useUserStocksContext() {
    return useContext(UserStocksContext)
}

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [tradingModalState, tradingModalDispatch] = useReducer(
        tradingModalReducer,
        initTradingModalState
    )
    const [userStocksState, userStocksDispatch] = useReducer(
        userStocksReducer,
        initUserStocksState
    )

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
                        }
                    }
                )
                userStocksDispatch({ type: 'INIT_STOCK', state: portfolioData })
            } catch (error) {
                console.error('Error fetching portfolio data:', error)
            }
        }
        testFetch()
    }, [])

    return (
        <TradingContext.Provider
            value={{ tradingModalState, tradingModalDispatch }}
        >
            <UserStocksContext.Provider
                value={{ userStocksState, userStocksDispatch }}
            >
                {children}
            </UserStocksContext.Provider>
        </TradingContext.Provider>
    )
}
