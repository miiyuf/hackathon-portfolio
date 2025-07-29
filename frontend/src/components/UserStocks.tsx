import React from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
    { field: 'ticker', headerName: 'Ticker', width: 130 },
    { field: 'stockName', headerName: 'Company', width: 130 },
    { field: 'qty', headerName: 'Quantity', width: 130, type: 'number' },
    {
        field: 'costPrice',
        headerName: 'Cost Price ($)',
        type: 'number',
        width: 130,
    },
    {
        field: 'amtInvested',
        headerName: 'Amount Invested ($)',
        type: 'number',
        width: 200,
        valueGetter: (value, row) => `$${row.qty * row.costPrice}`,
    },
]

const rows = [
    { id: 1, ticker: 'AAPL', stockName: 'Apple', qty: 10, costPrice: 35 },
    { id: 2, ticker: 'NFLX', stockName: 'Netflix', qty: 40, costPrice: 200 },
    { id: 3, ticker: 'NVDA', stockName: 'NVIDIA', qty: 40, costPrice: 160.7 },
    { id: 4, ticker: 'NVDA', stockName: 'NVIDIA', qty: 40, costPrice: 160 },
    { id: 5, ticker: 'NVDA', stockName: 'NVIDIA', qty: 40, costPrice: 160 },
    { id: 6, ticker: 'NVDA', stockName: 'NVIDIA', qty: 40, costPrice: 160 },
]

function UserStocks() {
    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    )
}

export default UserStocks
