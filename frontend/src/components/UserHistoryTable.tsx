import React from 'react'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material'

function UserHistoryTable() {
    interface Column {
        id:
            | 'ticker'
            | 'company'
            | 'qty'
            | 'action'
            | 'purchasePrice'
            | 'totalAmount'
            | 'date'
        label: string
        minWidth?: number
        align?: 'right' | 'left'
        format?: (value: number) => string
    }

    const columns: readonly Column[] = [
        { id: 'ticker', label: 'Symbol', minWidth: 100, align: 'left' },
        { id: 'company', label: 'Company', minWidth: 100, align: 'left' },
        {
            id: 'qty',
            label: 'Quantity',
            minWidth: 70,
            align: 'right',
            format: (value: number) => value.toLocaleString('en-US'),
        },
        {
            id: 'action',
            label: 'Action',
            minWidth: 70,
            align: 'left',
        },
        {
            id: 'purchasePrice',
            label: 'Purchase Price ($)',
            minWidth: 100,
            align: 'right',
        },
        {
            id: 'totalAmount',
            label: 'Total Amount ($)',
            minWidth: 100,
            align: 'right',
            format: (value: number) => value.toFixed(2),
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 100,
            align: 'left',
        },
    ]

    const rows = [
        {
            id: 1,
            ticker: 'AAPL',
            company: 'Apple',
            qty: 10,
            action: 'Buy',
            purchasePrice: 150,
            totalAmount: 1500,
            date: '2023-10-01',
        },
        {
            id: 2,
            ticker: 'MSFT',
            company: 'Microsoft',
            qty: 5,
            action: 'Sell',
            purchasePrice: 300,
            totalAmount: 1500,
            date: '2023-10-05',
        },
        {
            id: 3,
            ticker: 'GOOGL',
            company: 'Alphabet',
            qty: 8,
            action: 'Buy',
            purchasePrice: 2800,
            totalAmount: 22400,
            date: '2023-10-10',
        },
        {
            id: 4,
            ticker: 'AMZN',
            company: 'Amazon',
            qty: 3,
            action: 'Buy',
            purchasePrice: 3400,
            totalAmount: 10200,
            date: '2023-10-12',
        },
        {
            id: 5,
            ticker: 'TSLA',
            company: 'Tesla',
            qty: 7,
            action: 'Sell',
            purchasePrice: 700,
            totalAmount: 4900,
            date: '2023-10-15',
        },
        {
            id: 6,
            ticker: 'NFLX',
            company: 'Netflix',
            qty: 4,
            action: 'Buy',
            purchasePrice: 600,
            totalAmount: 2400,
            date: '2023-10-18',
        },
        {
            id: 7,
            ticker: 'NVDA',
            company: 'Nvidia',
            qty: 12,
            action: 'Buy',
            purchasePrice: 160,
            totalAmount: 1920,
            date: '2023-10-20',
        },
        {
            id: 8,
            ticker: 'META',
            company: 'Meta Platforms',
            qty: 6,
            action: 'Sell',
            purchasePrice: 355,
            totalAmount: 2130,
            date: '2023-10-22',
        },
        {
            id: 9,
            ticker: 'BABA',
            company: 'Alibaba',
            qty: 15,
            action: 'Buy',
            purchasePrice: 170,
            totalAmount: 2550,
            date: '2023-10-25',
        },
        {
            id: 10,
            ticker: 'ORCL',
            company: 'Oracle',
            qty: 9,
            action: 'Buy',
            purchasePrice: 90,
            totalAmount: 810,
            date: '2023-10-27',
        },
        {
            id: 11,
            ticker: 'INTC',
            company: 'Intel',
            qty: 20,
            action: 'Sell',
            purchasePrice: 55,
            totalAmount: 1100,
            date: '2023-10-29',
        },
        {
            id: 12,
            ticker: 'ADBE',
            company: 'Adobe',
            qty: 2,
            action: 'Buy',
            purchasePrice: 650,
            totalAmount: 1300,
            date: '2023-11-01',
        },
        {
            id: 13,
            ticker: 'CRM',
            company: 'Salesforce',
            qty: 7,
            action: 'Buy',
            purchasePrice: 250,
            totalAmount: 1750,
            date: '2023-11-03',
        },
        {
            id: 14,
            ticker: 'PYPL',
            company: 'PayPal',
            qty: 11,
            action: 'Sell',
            purchasePrice: 190,
            totalAmount: 2090,
            date: '2023-11-05',
        },
        {
            id: 15,
            ticker: 'UBER',
            company: 'Uber',
            qty: 13,
            action: 'Buy',
            purchasePrice: 45,
            totalAmount: 585,
            date: '2023-11-07',
        },
        {
            id: 16,
            ticker: 'SHOP',
            company: 'Shopify',
            qty: 4,
            action: 'Buy',
            purchasePrice: 1400,
            totalAmount: 5600,
            date: '2023-11-09',
        },
        {
            id: 17,
            ticker: 'SQ',
            company: 'Block',
            qty: 10,
            action: 'Sell',
            purchasePrice: 220,
            totalAmount: 2200,
            date: '2023-11-11',
        },
        {
            id: 18,
            ticker: 'ZM',
            company: 'Zoom',
            qty: 6,
            action: 'Buy',
            purchasePrice: 300,
            totalAmount: 1800,
            date: '2023-11-13',
        },
        {
            id: 19,
            ticker: 'SPOT',
            company: 'Spotify',
            qty: 8,
            action: 'Buy',
            purchasePrice: 250,
            totalAmount: 2000,
            date: '2023-11-15',
        },
        {
            id: 20,
            ticker: 'TWTR',
            company: 'Twitter',
            qty: 5,
            action: 'Sell',
            purchasePrice: 60,
            totalAmount: 300,
            date: '2023-11-17',
        },
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id]
                                            if (
                                                row.action === 'Buy' &&
                                                column.id === 'totalAmount'
                                            ) {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        {`(${value})`}
                                                    </TableCell>
                                                )
                                            }
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    {column.format &&
                                                    typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default UserHistoryTable
