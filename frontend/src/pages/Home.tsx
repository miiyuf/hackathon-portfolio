import React, { useState } from 'react'
import UserStocksTable from '../components/UserStocksTable'
import './Home.css'
import PieChart from '../components/PieChart'
import LineGraph from '../components/LineGraph'

function Home() {
    const [selectedUserStock, setSelectedUserStock] = useState('AAPL')

    return (
        <div className="internal-tab home-tab">
            <div style={{ display: 'flex' }}>
                <PieChart handleStockSelection={setSelectedUserStock} />
                <LineGraph selectedUserStock={selectedUserStock} />
            </div>
            <div>
                <UserStocksTable handleStockSelection={setSelectedUserStock} />
            </div>
        </div>
    )
}

export default Home
