import axios from 'axios'
import { type UserStockState } from '../GlobalContext'

const API = axios.create({
    baseURL: 'http://localhost:8000',
})

interface UserStockStateRes {
    cost_price: string
    name: string
    symbol: string
    total_quantity: string
}

export const getUserStocks = () =>
    API.get('/api/holdings')
        .then((res) => {
            const userStocks: UserStockState[] = res.data.map(
                (userStock: UserStockStateRes, i: number) => {
                    return {
                        id: i,
                        ticker: userStock.symbol,
                        stockName: userStock.name,
                        qty: parseInt(userStock.total_quantity),
                        costPrice: parseFloat(userStock.cost_price),
                    }
                }
            )
            return userStocks
        })
        .catch(function (error) {
            console.log(error)
        })
        .finally(function () {
            console.log('end of get user stocks')
        })
