import React from 'react'
import { useState, useEffect } from 'react'
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { fetchLongTermStockHistory } from '../api/stocks'
import { useGraphContext } from '../contexts/GraphContext'
import { useSelectedStockContext } from '../contexts/SelectedStockContext'
import { fetchLongTermProfitLoss } from '../api/stocks'

function LineGraph() {
    const [lineGraphData, setLineGraphData] = useState<number[]>([])
    const [lineChartView, setLineChartView] = useState('stock')
    const { graphState, graphDispatch } = useGraphContext()
    const { selectedStockDispatch, selectedStockState } =
        useSelectedStockContext()
    const getLongTerm = async () => {
        if (selectedStockState.selectedStock !== '') {
            const stockHistory = await fetchLongTermStockHistory(
                selectedStockState.selectedStock
            )
            graphDispatch({
                type: 'INIT_GRAPH',
                state: { graphData: stockHistory },
            })
        } else {
            graphDispatch({
                type: 'INIT_GRAPH',
                state: { graphData: [] },
            })
        }
    }

    const getLongTermProfitLoss = async (days: number) => {
        const plhistory = await fetchLongTermProfitLoss(days)
        graphDispatch({
            type: 'INIT_GRAPH',
            state: { graphData: plhistory },
        })
    }

    useEffect(() => {
        if (lineChartView === 'stock') {
            getLongTerm()
        } else {
            getLongTermProfitLoss(10)
        }
    }, [selectedStockState.selectedStock, lineChartView])

    const handleLineChartViewChange = (
        e: React.MouseEvent<HTMLElement>,
        newView: string
    ) => {
        if (newView !== null) {
            setLineChartView(newView)
        }
    }
    const dateFormatter = Intl.DateTimeFormat(undefined, {
        month: '2-digit',
        day: '2-digit',
    })
    const [date, setDate] = React.useState(new Date())
    const [graphPeriod, setGraphPeriod] = useState(10)

    return (
        <div>
            <LineChart
                height={300}
                width={650}
                series={[
                    {
                        data: graphState.graphData || [],
                        label: `${lineChartView === 'stock' ? selectedStockState.selectedStock : 'P&L (%)'}`,
                        area: true,
                        showMark: false,
                        color: 'rgba(28, 144, 30, 0.5)',
                    },
                ]}
                xAxis={[
                    {
                        scaleType: 'point',
                        data: Array.from({ length: graphPeriod })
                            .map(
                                (_, i) =>
                                    new Date(
                                        date.getTime() -
                                            i * (24 * 60 * 60 * 1000)
                                    )
                            )
                            .reverse(),
                        valueFormatter: (value: Date) =>
                            dateFormatter.format(value),
                    },
                ]}
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
