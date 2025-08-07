import React, { useState, useEffect } from 'react'
import UserStocksTable from '../components/UserStocksTable'
import './Home.css'
import PieChart from '../components/PieChart'
import LineGraph from '../components/LineGraph'
import TotalPortfolioInfo from '../components/TotalPortfolioInfo'
import { useCurrentPrices } from '../contexts/CurrentPricesContext';

function Home() {
    return (
        <div className="internal-tab home-tab">
            <TotalPortfolioInfo />
            <div style={{ display: 'flex' }}>
                <PieChart />
                <LineGraph />
            </div>
            <div style={{ marginTop: 30 }}>
                <UserStocksTable  /*current_prices={ current_prices }*//>
            </div>
        </div>
    )
}

export default Home
