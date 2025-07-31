import React from 'react'
import UserStocksTable from '../components/UserStocksTable'
import './Home.css'
import PieChart from '../components/PieChart'
import LineGraph from '../components/LineGraph'

function Home() {
    return (
        <div className="internal-tab home-tab">
            <div style={{ display: 'flex' }}>
                <PieChart />
                <LineGraph />
            </div>
            <div>
                <UserStocksTable />
            </div>
        </div>
    )
}

export default Home
