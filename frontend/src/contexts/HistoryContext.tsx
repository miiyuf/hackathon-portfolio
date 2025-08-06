import type React from 'react'
import { createContext, useContext, useReducer } from 'react'
import { fetchTransactions } from '../api/stocks'

export interface HistoryState {
    id: number
    ticker: string
    company: string
    qty: number
    action: string
    purchasePrice: number
    totalAmount: number
    date: string
}

interface HistoryContextType {
    historyState: HistoryState[]
    historyDispatch: React.Dispatch<{
        type: string
        state?: HistoryState[]
    }>
}

const initHistoryState: HistoryState[] = []

const initHistoryContext: HistoryContextType = {
    historyState: initHistoryState,
    historyDispatch: () => {},
}

const HistoryContext = createContext<HistoryContextType>(initHistoryContext)

function historyReducer(
    state: HistoryState[],
    action: { type: string; state?: HistoryState[] }
): HistoryState[] {
    switch (action.type) {
        case 'INIT_HISTORY':
            return action.state ? [...action.state] : state
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}

export function useHistoryContext() {
    return useContext(HistoryContext)
}

export const fetchTransactionHistory = async (
    historyDispatch: React.Dispatch<{
        type: string
        state?: HistoryState[]
    }>
) => {
    try {
        const transactionHistory = await fetchTransactions()
        const parsedTransactionHistory = transactionHistory.map(
            (transaction, index) => {
                return {
                    id: index,
                    ticker: transaction.symbol,
                    company: transaction.name,
                    qty: transaction.quantity,
                    action: transaction.action === 'buy' ? 'Buy' : 'Sell',
                    purchasePrice: transaction.purchase_price,
                    totalAmount:
                        transaction.purchase_price * transaction.quantity,
                    date: transaction.transaction_date ?? 'N/A',
                }
            }
        )
        historyDispatch({
            type: 'INIT_HISTORY',
            state: parsedTransactionHistory,
        })
    } catch (error) {
        console.log('Error fetching transaction history: ', error)
    }
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const [historyState, historyDispatch] = useReducer(
        historyReducer,
        initHistoryState
    )

    return (
        <HistoryContext.Provider value={{ historyState, historyDispatch }}>
            {children}
        </HistoryContext.Provider>
    )
}
