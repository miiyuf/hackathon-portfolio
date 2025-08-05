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

function Home() {
    const [selectedUserStock, setSelectedUserStock] = useState('AAPL')

    return (
        <div
            className="internal-tab home-tab"
            style={{ paddingTop: 60, width: 1050 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <PieChart handleStockSelection={setSelectedUserStock} />
                <LineGraph selectedUserStock={selectedUserStock} />
            </div>
            <div style={{ display: 'flex' }}>
                <UserStocksTable handleStockSelection={setSelectedUserStock} />
            </div>
        </div>
    )
}

export default Home
