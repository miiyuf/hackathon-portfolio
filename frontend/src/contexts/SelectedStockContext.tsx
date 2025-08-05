import { useContext, createContext, useReducer } from 'react'

interface SelectedStockContextType {
    selectedStockState: SelectedStockState
    selectedStockDispatch: React.Dispatch<{
        type: string
        state?: SelectedStockState
    }>
}
interface SelectedStockState {
    selectedStock: string
}

const initSelectedStockState: SelectedStockState = {
    selectedStock: '',
}

const initSelectedStockContext: SelectedStockContextType = {
    selectedStockState: initSelectedStockState,
    selectedStockDispatch: () => {},
}

const SelectedStockContext = createContext<SelectedStockContextType>(
    initSelectedStockContext
)

function selectedStockReducer(
    state: SelectedStockState,
    action: {
        type: string
        state?: SelectedStockState
    }
) {
    switch (action.type) {
        case 'SELECT_STOCK':
            return action.state ? action.state : state
        case 'RESET_STOCK':
            const init_stock: SelectedStockState = {
                selectedStock: '',
            }
            return init_stock
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}

export function useSelectedStockContext() {
    return useContext(SelectedStockContext)
}

export function SelectedStockProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [selectedStockState, selectedStockDispatch] = useReducer(
        selectedStockReducer,
        initSelectedStockState
    )
    return (
        <SelectedStockContext.Provider
            value={{ selectedStockState, selectedStockDispatch }}
        >
            {children}
        </SelectedStockContext.Provider>
    )
}
