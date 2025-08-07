import { useContext, createContext, useReducer } from 'react'
import type { HoldingData } from '../api/stocks'

interface GraphState {
    graphData: number[]
}

interface GraphContextType {
    graphState: GraphState
    graphDispatch: React.Dispatch<{
        type: string
        state?: GraphState
    }>
}

const initGraphState: GraphState = {
    graphData: [],
}

const initGraphContext: GraphContextType = {
    graphState: initGraphState,
    graphDispatch: () => {},
}

const GraphContext = createContext<GraphContextType>(initGraphContext)

function graphReducer(
    state: GraphState,
    action: {
        type: string
        state?: GraphState
    }
) {
    switch (action.type) {
        case 'INIT_GRAPH':
            return action.state ? { graphData: action.state.graphData } : state

        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}

export function useGraphContext() {
    return useContext(GraphContext)
}

export function GraphContextProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [graphState, graphDispatch] = useReducer(graphReducer, initGraphState)
    return (
        <GraphContext.Provider value={{ graphState, graphDispatch }}>
            {children}
        </GraphContext.Provider>
    )
}
