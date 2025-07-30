import React from 'react'
import UserStocksTable from '../components/UserStocksTable'
import './Home.css'
import PieChart from '../components/PieChart'

function Home() {
    return (
        <div className="internal-tab home-tab">
            <PieChart />
            <UserStocksTable />
        </div>
    )
}

export default Home
