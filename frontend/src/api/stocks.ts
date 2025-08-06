import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL, // || 'http://localhost:8000',
})
export interface HoldingData {
    symbol: string
    name: string
    total_quantity: number
    purchase_price: number
    current_price: number
    unrealized_profit_loss: string
}

export const fetchPortfolioData = async (): Promise<HoldingData[]> => {
    try {
        const res = await API.get('/api/portfolio')
        return res.data.holdings
    } catch (error) {
        console.error('Failed to fetch portfolio data:', error)
        throw error
    }
}

export interface StockTransaction {
    symbol: string
    purchase_price: number
    action: 'buy' | 'sell'
    quantity: number
}

export const addStockTransaction = async (
    data: StockTransaction
): Promise<any> => {
    try {
        const response = await API.post(`/api/stocks`, data)
        return response.data
    } catch (error) {
        console.error('Error adding stock transaction:', error)
        throw error
    }
}

export const fetchCurrentPrice = async (symbol: string): Promise<number> => {
    try {
        const response = await API.get(`/api/price/${symbol}`)
        return response.data.price
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error)
        throw error
    }
}

export const fetchHoldingsQuantity = async (
    symbol: string
): Promise<number> => {
    try {
        const response = await API.get(`/api/holdings`)
        const holdings = response.data
        const holding = holdings.find((h: HoldingData) => h.symbol === symbol)
        return holding ? holding.total_quantity : 0
    } catch (error) {
        console.error(`Error fetching holdings quantity for ${symbol}:`, error)
        throw error
    }
}

export interface TransactionData {
    id: number
    symbol: string
    name: string
    action: 'buy' | 'sell'
    quantity: number
    purchase_price: number
    transaction_date: string
}

export const fetchTransactions = async (): Promise<TransactionData[]> => {
    try {
        const response = await API.get(`/api/transaction`)
        return response.data
    } catch (error) {
        console.error('Error fetching transactions:', error)
        throw error
    }
}

export interface PortfolioData {
    holdings: HoldingData[]
    total_net_investment: string
    total_portfolio_balance: string
}

export const fetchTotalPortfolioBalance = async (): Promise<PortfolioData> => {
    try {
        const response = await API.get('/api/portfolio')
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching transactions:', error)
        throw error
    }
}

export const fetchLongTermStockHistory = async (
    symbol: string
): Promise<[]> => {
    try {
        const response = await API.get(`/api/long_term_price/${symbol}`)
        return response.data.long_term_price
    } catch (error) {
        console.error('Error fetching profit/loss data:', error)
        throw error
    }
}
