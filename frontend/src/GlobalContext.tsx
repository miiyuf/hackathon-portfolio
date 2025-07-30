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

const GlobalContext = createContext<TradingModalContextType>(
    initTradingModalContext
)

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [tradingModalState, tradingModalDispatch] = useReducer(
        tradingModalReducer,
        initTradingModalState
    )

    return (
        <GlobalContext.Provider
            value={{ tradingModalState, tradingModalDispatch }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

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

const initTradingModalState: TradingModalState = {
    isOpen: false,
    symbol: '',
}

export function useGlobalContext() {
    return useContext(GlobalContext)
}
