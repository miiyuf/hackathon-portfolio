import React from 'react'
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart'
const uData = [1000, 2000, 1800, 1000, 3000, 1590, 5000]
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
]
function LineGraph() {
    return (
        <div>
            <LineChart
                height={300}
                width={700}
                series={[
                    {
                        data: uData,
                        label: 'balance',
                        area: true,
                        showMark: false,
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                sx={{
                    [`& .${lineElementClasses.root}`]: {
                        display: 'none',
                    },
                }}
            />
        </div>
    )
}

export default LineGraph
