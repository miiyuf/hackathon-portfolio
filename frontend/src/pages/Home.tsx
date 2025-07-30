import React from 'react'
import UserStocksTable from '../components/UserStocksTable'
import './Home.css'

function Home() {
    return (
        <div className="internal-tab">
            <UserStocksTable />
        </div>
    )
}

export default Home
