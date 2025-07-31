import React, { useEffect, useState } from 'react'
import { PieChart as MuiPieChart } from '@mui/x-charts'
import { useUserStocksContext } from '../GlobalContext'
import { Tooltip } from '@mui/material'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
interface pieChartData {
    id: number
    value: number
    label: string
}
function PieChart() {
    const { userStocksState } = useUserStocksContext()
    const [totalStocksValue, setTotalStocksValue] = useState(1)
    const [pieChartView, setPieChartView] = useState('individualHoldings')
    const [pieChartData, setPieChartData] = useState<readonly pieChartData[]>(
        userStocksState.map((stock, index) => ({
            id: index,
            value: stock.qty * stock.costPrice,
            label: stock.ticker,
        }))
    )

    const handlePieChartView = (
        e: React.MouseEvent<HTMLElement>,
        newView: string
    ) => {
        setPieChartView(newView)
    }

    useEffect(() => {
        let totalValue = 0
        userStocksState.forEach((stock) => {
            totalValue += stock.qty * stock.costPrice
        })
        setTotalStocksValue(totalValue)
    }, [userStocksState])

    useEffect(() => {
        switch (pieChartView) {
            case 'individualHoldings':
                setPieChartData(
                    userStocksState.map((stock, index) => ({
                        id: index,
                        value: stock.qty * stock.costPrice,
                        label: stock.ticker,
                    }))
                )
                break
            case 'country':
                setPieChartData([
                    { id: 1, value: 10, label: 'Japan' },
                    { id: 2, value: 10, label: 'Singapore' },
                    { id: 3, value: 10, label: 'US' },
                ])
                break
            case 'sector':
                setPieChartData([
                    { id: 1, value: 10, label: 'A' },
                    { id: 2, value: 10, label: 'B' },
                    { id: 3, value: 30, label: 'C' },
                    { id: 4, value: 10, label: 'D' },
                ])
                break
            case 'industry':
                setPieChartData([
                    { id: 1, value: 10, label: 'A' },
                    { id: 2, value: 10, label: 'B' },
                    { id: 3, value: 30, label: 'C' },
                    { id: 4, value: 10, label: 'D' },
                    { id: 5, value: 50, label: 'E' },
                    { id: 6, value: 30, label: 'F' },
                ])
                break
        }
    }, [pieChartView])
    return (
        <div>
            <MuiPieChart
                series={[
                    {
                        data: pieChartData,
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 3,
                        cornerRadius: 5,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        valueFormatter: (value) =>
                            `${((value.value / totalStocksValue) * 100).toFixed(2)}%`,
                    },
                ]}
                width={200}
                height={300}
            />
            <ToggleButtonGroup
                value={pieChartView}
                exclusive
                onChange={handlePieChartView}
                aria-label="text alignment"
            >
                <ToggleButton
                    value="individualHoldings"
                    aria-label="right aligned"
                >
                    individual holdings
                </ToggleButton>
                <ToggleButton value="country" aria-label="left aligned">
                    country
                </ToggleButton>
                <ToggleButton value="sector" aria-label="centered">
                    sector
                </ToggleButton>
                <ToggleButton value="industry" aria-label="right aligned">
                    industry
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default PieChart
