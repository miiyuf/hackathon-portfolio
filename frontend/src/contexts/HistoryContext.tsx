import type React from 'react'
import { createContext, useContext, useReducer } from 'react'

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
        state: HistoryState[]
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
