    import axios from 'axios';

    const API_URL = 'http://localhost:8000/api';

    export interface HoldingData {
    symbol: string;
    name?: string;
    total_quantity: number;
    purchase_price: number;
    current_price?: number;
    profit_loss?: number;
    }

    export const fetchProfitLoss = async (): Promise<HoldingData[]> => {
    try {
        const response = await axios.get(`${API_URL}/profit_loss`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profit/loss data:', error);
        throw error;
    }
    };

    export const fetchPortfolio = async (): Promise<HoldingData[]> => {
    try {
        const response = await axios.get(`${API_URL}/portfolio`);
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        throw error;
    }
    };

    export const addStockTransaction = async (data: {
    symbol: string;
    purchase_price: number;
    action: 'buy' | 'sell';
    quantity: number;
    }): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/stocks`, data);
        return response.data;
    } catch (error) {
        console.error('Error adding stock transaction:', error);
        throw error;
    }
    };

    export const fetchCurrentPrice = async (symbol: string): Promise<number> => {
    try {
        const response = await axios.get(`${API_URL}/price/${symbol}`);
        return response.data.price;
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        throw error;
    }
    };

    export interface TransactionData {
    id: number;
    symbol: string;
    action: 'buy' | 'sell';
    quantity: number;
    purchase_price: number;
    transaction_date: string;
    }

    export const fetchTransactions = async (): Promise<TransactionData[]> => {
    try {
        const response = await axios.get(`${API_URL}/transactions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
    };

