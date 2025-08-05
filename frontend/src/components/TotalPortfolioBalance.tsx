import { Typography } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import { fetchTotalPortfolioBalance } from '../api/stocks'

function TotalPortfolioBalance() {
    const [portfolioBalance, setPortfolioBalance] = useState('')
    const getPortfolioBalance = async () => {
        const portfolioData = await fetchTotalPortfolioBalance()
        setPortfolioBalance(portfolioData.total_net_investment)
    }
    useEffect(() => {
        getPortfolioBalance()
    }, [])
    return (
        <div style={{ textAlign: 'left', paddingTop: 10, paddingBottom: 20 }}>
            <Typography variant="h4">
                Total Portfolio Balance: ${portfolioBalance}
            </Typography>
        </div>
    )
}

export default TotalPortfolioBalance
