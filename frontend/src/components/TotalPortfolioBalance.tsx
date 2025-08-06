import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { fetchTotalPortfolioBalance } from '../api/stocks'
import { usePortfolioBalanceContext } from '../contexts/PortfolioBalanceContext'
import { getPortfolioBalance } from '../contexts/PortfolioBalanceContext'

function TotalPortfolioBalance() {
    const { portfolioBalanceState, portfolioBalanceDispatch } =
        usePortfolioBalanceContext()

    useEffect(() => {
        getPortfolioBalance(portfolioBalanceDispatch)
    }, [])

    return (
        <div style={{ textAlign: 'left', paddingTop: 10, paddingBottom: 20 }}>
            <Typography variant="h4">
                Total Portfolio Balance: $
                {portfolioBalanceState.portfolioBalance}
            </Typography>
        </div>
    )
}

export default TotalPortfolioBalance
