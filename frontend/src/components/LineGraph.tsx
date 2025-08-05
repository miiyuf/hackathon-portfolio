import React from 'react'
import { useState, useEffect } from 'react'
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
const xLabels = ['Jul 1', 'Jul 7', 'Jul 14', 'Jul 21', 'Jul 28', 'Today']

interface LineGraphProps {
    selectedUserStock: string
}
function LineGraph(props: LineGraphProps) {
    const { selectedUserStock } = props
    const [lineGraphData, setLineGraphData] = useState<number[]>([])
    const [lineChartView, setLineChartView] = useState('stock')
    const handleLineChartViewChange = (
        e: React.MouseEvent<HTMLElement>,
        newView: string
    ) => {
        setLineChartView(newView)
    }
    useEffect(() => {
        switch (lineChartView) {
            case 'stock':
                setLineGraphData([1000, 2800, 1050, 1890, 1505, 3800])
                break
            case 'portfolio':
                setLineGraphData([2000, 1000, 1500, 3400, 4000, 3200])
                break
        }
    }, [lineChartView])
    return (
        <div>
            <LineChart
                height={300}
                width={650}
                series={[
                    {
                        data: lineGraphData,
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
            <ToggleButtonGroup
                value={lineChartView}
                exclusive
                onChange={handleLineChartViewChange}
                aria-label="pie chart view options"
                sx={{
                    height: 30,
                }}
            >
                <ToggleButton value="stock" aria-label="right aligned">
                    individual holding
                </ToggleButton>
                <ToggleButton value="portfolio" aria-label="right aligned">
                    total portfolio balance
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default LineGraph
