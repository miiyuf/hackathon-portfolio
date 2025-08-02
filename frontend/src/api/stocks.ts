import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL, // || 'http://localhost:8000',
})

export interface PortfolioData {
    symbol: string
    name: string
    total_quantity: number
    purchase_price: number
    current_price: number
    profit_loss: number
}

export const fetchPortfolioData = async (): Promise<PortfolioData[]> => {
    try {
        const res = await API.get('/api/portfolio')
        return res.data
    } catch (error) {
        console.error('Failed to fetch portfolio data:', error)
        throw error
    }
}

export const addStockTransaction = async (data: {
    symbol: string
    purchase_price: number
    action: 'buy' | 'sell'
    quantity: number
}): Promise<any> => {
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

export interface TransactionData {
    id: number
    symbol: string
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

// export const fetchProfitLoss = async (): Promise<HoldingData[]> => {
//     try {
//         const response = await axios.get(`${API_URL}/profit_loss`)
//         return response.data
//     } catch (error) {
//         console.error('Error fetching profit/loss data:', error)
//         throw error
//     }
// }
