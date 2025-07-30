import React from 'react'
import { PieChart as MuiPieChart } from '@mui/x-charts'
import { useUserStocksContext } from '../GlobalContext'

function PieChart() {
    const { userStocksState } = useUserStocksContext()
    return (
        <MuiPieChart
            series={[
                {
                    data: userStocksState.map((stock, index) => ({
                        id: index,
                        value: stock.qty,
                        label: stock.ticker,
                    })),
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 3,
                    cornerRadius: 5,
                    highlightScope: { fade: 'global', highlight: 'item' },
                },
            ]}
            width={200}
            height={200}
        />
    )
}

export default PieChart
