import React from 'react'
import UserStocks from './UserStocks'

function DashboardCard() {
    return (
        <div className="bg-gray dark:bg-gray-800 rounded-lg px-60 py-40 ring shadow-xl ring-gray-900/5">
            <div>Your Positions</div>
            <UserStocks />
        </div>
    )
}

export default DashboardCard
