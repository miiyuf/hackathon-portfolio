import React from 'react'
import UserStocksTable from '../components/UserStocksTable'

function Home() {
    return (
        <div style={{ display: 'flex', marginLeft: 240 }}>
            <UserStocksTable />
        </div>
    )
}

export default Home
