import React from 'react'
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart'
import { Paper } from '@mui/material'
const uData = [1000, 2800, 1050, 1890, 1505, 3800]
const xLabels = ['Jul 1', 'Jul 7', 'Jul 14', 'Jul 21', 'Jul 28', 'Today']

interface LineGraphProps {
    selectedUserStock: string
}
function LineGraph(props: LineGraphProps) {
    const { selectedUserStock } = props
    return (
        <Paper sx={{ borderRadius: 4, boxShadow: 2 }} elevation={0}>
            <LineChart
                height={300}
                width={600}
                series={[
                    {
                        data: uData,
                        label: `${selectedUserStock}`,
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
        </Paper>
    )
}

export default LineGraph
