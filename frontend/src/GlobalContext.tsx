import { createContext, useReducer, useContext } from 'react'

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

interface UserStockState {
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
        state?: UserStockState
    }>
}

const initUserStocksState: UserStockState[] = [
    { id: 1, ticker: 'AAPL', stockName: 'Apple', qty: 10, costPrice: 35 },
    {
        id: 2,
        ticker: 'NFLX',
        stockName: 'Netflix',
        qty: 40,
        costPrice: 200,
    },
    {
        id: 3,
        ticker: 'NVDA',
        stockName: 'Nvidia',
        qty: 40,
        costPrice: 160.7,
    },
    {
        id: 4,
        ticker: 'GOOGL',
        stockName: 'Alphabet',
        qty: 15,
        costPrice: 2800,
    },
    { id: 5, ticker: 'AMZN', stockName: 'Amazon', qty: 8, costPrice: 3400 },
    { id: 6, ticker: 'TSLA', stockName: 'Tesla', qty: 12, costPrice: 700 },
    {
        id: 7,
        ticker: 'MSFT',
        stockName: 'Microsoft',
        qty: 25,
        costPrice: 295,
    },
    {
        id: 8,
        ticker: 'META',
        stockName: 'Meta Platforms',
        qty: 18,
        costPrice: 355,
    },
]

const initUserStocksContext: UserStocksContextType = {
    userStocksState: initUserStocksState,
    userStocksDispatch: () => {},
}

const UserStocksContext = createContext<UserStocksContextType>(
    initUserStocksContext
)

function userStocksReducer(
    state: UserStockState[],
    action: { type: string; state?: UserStockState }
): UserStockState[] {
    switch (action.type) {
        case 'ADD_STOCK':
            return action.state ? [...state, action.state] : state
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
