import { useContext, createContext, useReducer } from 'react'
import { fetchTotalPortfolioBalance } from '../api/stocks'

interface PortfolioInfoState {
    portfolioBalance: string | undefined
    portfolioInvestment: string | undefined
}

interface PortfolioInfoContextType {
    portfolioInfoState: PortfolioInfoState
    portfolioInfoDispatch: React.Dispatch<{
        type: string
        state?: PortfolioInfoState
    }>
}

const initPortfolioInfoState: PortfolioInfoState = {
    portfolioBalance: '',
    portfolioInvestment: '',
}

const initPortfolioInfoContext: PortfolioInfoContextType = {
    portfolioInfoState: initPortfolioInfoState,
    portfolioInfoDispatch: () => {},
}

const PortfolioInfoContext = createContext<PortfolioInfoContextType>(
    initPortfolioInfoContext
)

function portfolioInfoReducer(
    state: PortfolioInfoState,
    action: {
        type: string
        state?: PortfolioInfoState
    }
) {
    switch (action.type) {
        case 'UPDATE_BALANCE':
            return {
                ...state,
                portfolioBalance: action.state?.portfolioBalance,
            }
        case 'UPDATE_INVESTMENT':
            return {
                ...state,
                portfolioInvestment: action.state?.portfolioInvestment,
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}

export function usePortfolioInfoContext() {
    return useContext(PortfolioInfoContext)
}

export const updatePortfolioBalance = async (
    portfolioInfoDispatch: React.Dispatch<{
        type: string
        state?: PortfolioInfoState
    }>
) => {
    const portfolioData = await fetchTotalPortfolioBalance()
    portfolioInfoDispatch({
        type: 'UPDATE_BALANCE',
        state: {
            portfolioBalance: portfolioData.total_portfolio_balance,
            portfolioInvestment: '',
        },
    })
}

export const updatePortfolioInvestment = async (
    portfolioInfoDispatch: React.Dispatch<{
        type: string
        state?: PortfolioInfoState
    }>
) => {
    const portfolioData = await fetchTotalPortfolioBalance()
    portfolioInfoDispatch({
        type: 'UPDATE_INVESTMENT',
        state: {
            portfolioBalance: '',
            portfolioInvestment: portfolioData.total_net_investment,
        },
    })
}

export function PortfolioBalanceProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [portfolioInfoState, portfolioInfoDispatch] = useReducer(
        portfolioInfoReducer,
        initPortfolioInfoState
    )
    return (
        <PortfolioInfoContext.Provider
            value={{ portfolioInfoState, portfolioInfoDispatch }}
        >
            {children}
        </PortfolioInfoContext.Provider>
    )
}
