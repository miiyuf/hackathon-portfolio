import React from 'react'
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart'
import { useSelectedStockContext } from '../contexts/SelectedStockContext'
const uData = [1000, 2800, 1050, 1890, 1505, 3800]
const xLabels = ['Jul 1', 'Jul 7', 'Jul 14', 'Jul 21', 'Jul 28', 'Today']

function LineGraph() {
    const { selectedStockState, selectedStockDispatch } =
        useSelectedStockContext()
    return (
        <div>
            <LineChart
                height={300}
                width={650}
                series={[
                    {
                        data: uData,
                        label: `${selectedStockState.selectedStock}`,
                        area: true,
                        showMark: false,
                        color: 'rgba(28, 144, 30, 0.5)',
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                sx={{
                    '.MuiAreaElement-root': {
                        fill: 'rgba(101, 199, 103, 0.5)',
                    },
                }}
            />
        </div>
    )
}

export default LineGraph
