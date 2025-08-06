import React from 'react'
import { useEffect } from 'react'
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
import { useHistoryContext } from '../contexts/HistoryContext'
import { fetchTransactionHistory } from '../contexts/HistoryContext'

function UserHistoryTable() {
    const { historyState, historyDispatch } = useHistoryContext()

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

    interface TransactionHistory {
        id: number
        ticker: string
        company: string
        qty: number
        action: string
        purchasePrice: number
        totalAmount: number
        date: string
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
            label: 'Timestamp',
            minWidth: 100,
            align: 'left',
        },
    ]

    useEffect(() => {
        fetchTransactionHistory(historyDispatch)
    }, [])

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
                        {historyState
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
                count={historyState.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default UserHistoryTable
