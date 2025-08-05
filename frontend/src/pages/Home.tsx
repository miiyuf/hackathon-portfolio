import React, { useState, useEffect } from 'react'
import UserStocksTable from '../components/UserStocksTable'
import './Home.css'
import PieChart from '../components/PieChart'
import LineGraph from '../components/LineGraph'
import {
    fetchPortfolioData,
    addStockTransaction,
    fetchCurrentPrice,
    fetchTransactions,
} from '../api/stocks'
import TotalPortfolioBalance from '../components/TotalPortfolioBalance'

function Home() {
    const [selectedUserStock, setSelectedUserStock] = useState('AAPL')

    // TEST CODE TO CHECK ENDPOINTS
    // useEffect(() => {
    //     const testFetch = async () => {
    //         try {
    //             const data = await fetchPortfolioData()
    //             console.log('Portfolio data:', data)
    //         } catch (error) {
    //             console.error('Error fetching portfolio data:', error)
    //         }
    //     }
    //     const testFetchPrice = async () => {
    //         try {
    //             const data = await fetchCurrentPrice('AAPL')
    //             console.log(data)
    //             return data
    //         } catch (error) {
    //             console.error('Error fetching portfolio data:', error)
    //         }
    //     }
    //     const testTransactions = async () => {
    //         try {
    //             const data = await fetchTransactions()
    //             console.log(data)
    //             return data
    //         } catch (error) {
    //             console.error('Error fetching portfolio data:', error)
    //         }
    //     }
    //     // const testAddStock = async () => {
    //     //     try {
    //     //         const res = await addStockTransaction({
    //     //             symbol: 'AAPL',
    //     //             purchase_price: 180,
    //     //             action: 'buy',
    //     //             quantity: 20,
    //     //         })
    //     //         return res
    //     //     } catch (error) {
    //     //         console.error('Error adding stock transaction:', error)
    //     //     }
    //     // }
    //     testFetch()
    //     // testAddStock()
    //     // testTransactions()
    // }, [])

    return (
        <div className="internal-tab home-tab">
            <TotalPortfolioBalance />
            <div style={{ display: 'flex' }}>
                <PieChart handleStockSelection={setSelectedUserStock} />
                <LineGraph selectedUserStock={selectedUserStock} />
            </div>
            <div style={{ marginTop: 30 }}>
                <UserStocksTable handleStockSelection={setSelectedUserStock} />
            </div>
        </div>
    )
}

export default Home
