import { useContext, createContext, useReducer, useEffect } from 'react'
import { fetchTotalPortfolioBalance } from '../api/stocks'

interface PortfolioBalanceState {
    portfolioBalance: string
}

interface PortfolioBalanceContextType {
    portfolioBalanceState: PortfolioBalanceState
    portfolioBalanceDispatch: React.Dispatch<{
        type: string
        state?: PortfolioBalanceState
    }>
}

const initPortfolioBalanceState: PortfolioBalanceState = {
    portfolioBalance: '',
}

const initPortfolioBalanceContext: PortfolioBalanceContextType = {
    portfolioBalanceState: initPortfolioBalanceState,
    portfolioBalanceDispatch: () => {},
}

const PortfolioBalanceContext = createContext<PortfolioBalanceContextType>(
    initPortfolioBalanceContext
)

function portfolioBalanceReducer(
    state: PortfolioBalanceState,
    action: {
        type: string
        state?: PortfolioBalanceState
    }
) {
    switch (action.type) {
        case 'UPDATE_BALANCE':
            return action.state ? action.state : state
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}

export function usePortfolioBalanceContext() {
    return useContext(PortfolioBalanceContext)
}

export const getPortfolioBalance = async (
    portfolioBalanceDispatch: React.Dispatch<{
        type: string
        state?: PortfolioBalanceState
    }>
) => {
    const portfolioData = await fetchTotalPortfolioBalance()
    portfolioBalanceDispatch({
        type: 'UPDATE_BALANCE',
        state: { portfolioBalance: portfolioData.total_net_investment },
    })
}

export function PortfolioBalanceProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [portfolioBalanceState, portfolioBalanceDispatch] = useReducer(
        portfolioBalanceReducer,
        initPortfolioBalanceState
    )
    return (
        <PortfolioBalanceContext.Provider
            value={{ portfolioBalanceState, portfolioBalanceDispatch }}
        >
            {children}
        </PortfolioBalanceContext.Provider>
    )
}
