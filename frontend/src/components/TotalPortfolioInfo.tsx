import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import {
    updatePortfolioInvestment,
    usePortfolioInfoContext,
} from '../contexts/PortfolioInfoContext'
import { updatePortfolioBalance } from '../contexts/PortfolioInfoContext'

// total portfolio balance = current price * owned stock
// total portfolio investment = cost price * owned stock

function TotalPortfolioInfo() {
    const { portfolioInfoState, portfolioInfoDispatch } =
        usePortfolioInfoContext()

    useEffect(() => {
        updatePortfolioBalance(portfolioInfoDispatch)
        updatePortfolioInvestment(portfolioInfoDispatch)
    }, [])

    return (
        <div style={{ textAlign: 'left', paddingTop: 10, paddingBottom: 20 }}>
            <Typography
                variant="h4"
                style={{
                    color:
                        Number(portfolioInfoState.portfolioBalance) > 0
                            ? 'green'
                            : 'red',
                }}
            >
                Total Portfolio Balance: $
                {Number(portfolioInfoState.portfolioBalance).toFixed(2)}
            </Typography>
            <Typography variant="h5" color="gray" mt={1}>
                Total Portfolio Investment: $
                {Number(portfolioInfoState.portfolioInvestment).toFixed(2)}
            </Typography>
        </div>
    )
}

export default TotalPortfolioInfo
