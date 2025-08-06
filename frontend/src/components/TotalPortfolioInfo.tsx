import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import {
    updatePortfolioInvestment,
    usePortfolioInfoContext,
} from '../contexts/PortfolioInfoContext'
import { updatePortfolioBalance } from '../contexts/PortfolioInfoContext'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

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
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4">
                    Total Portfolio Balance:{' '}
                    <span
                        style={{
                            color:
                                Number(portfolioInfoState.portfolioBalance) > 0
                                    ? '#55cb38ff'
                                    : 'red',
                        }}
                    >
                        $
                        {Number(portfolioInfoState.portfolioBalance).toFixed(2)}
                    </span>
                </Typography>
                <div style={{ marginLeft: 10 }}>
                    {Number(portfolioInfoState.portfolioBalance) > 0 ? (
                        <TrendingUpIcon style={{ color: '#55cb38ff' }} />
                    ) : (
                        <TrendingDownIcon style={{ color: 'red' }} />
                    )}
                </div>
            </div>

            <Typography variant="h5" color="gray" mt={1}>
                Total Portfolio Investment: $
                {Number(portfolioInfoState.portfolioInvestment).toFixed(2)}
            </Typography>
        </div>
    )
}

export default TotalPortfolioInfo
