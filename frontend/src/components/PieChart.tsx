import React, { useEffect } from 'react'
import { PieChart as MuiPieChart } from '@mui/x-charts'
import { useUserStocksContext } from '../GlobalContext'
import { Tooltip } from '@mui/material'

function PieChart() {
    const { userStocksState } = useUserStocksContext()
    const [totalStocksValue, setTotalStocksValue] = React.useState(1)

    useEffect(() => {
        let totalValue = 0
        userStocksState.forEach((stock) => {
            totalValue += stock.qty * stock.costPrice
        })
        setTotalStocksValue(totalValue)
    }, [userStocksState])
    return (
        <MuiPieChart
            series={[
                {
                    data: userStocksState.map((stock, index) => ({
                        id: index,
                        value: stock.qty * stock.costPrice,
                        label: stock.ticker,
                    })),
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
            height={200}
        />
    )
}

export default PieChart
