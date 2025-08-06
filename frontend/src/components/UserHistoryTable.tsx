import React, { useState } from 'react'
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
    TableSortLabel,
    Box,
    Chip,
    Typography
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { useHistoryContext } from '../contexts/HistoryContext'
import { fetchTransactionHistory } from '../contexts/HistoryContext'

type Order = 'asc' | 'desc'

function UserHistoryTable() {
    const { historyState, historyDispatch } = useHistoryContext()
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<keyof TransactionHistory>('date')
    const [companyFilter, setCompanyFilter] = useState<string | null>(null)
    const [actionFilter, setActionFilter] = useState<string | null>(null) // Action用のフィルター状態を追加

    const handleCompanyClick = (company: string) => {
        setCompanyFilter(currentFilter => currentFilter === company ? null : company)
        setPage(0)
    }

    const handleClearFilters = () => {
        setCompanyFilter(null)
        setActionFilter(null)
    }

    const handleActionClick = (action: string) => {
        setActionFilter(currentFilter => currentFilter === action ? null : action)
        setPage(0)
    }

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

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (orderBy === 'date') {
            const dateA = new Date(a[orderBy] as string)
            const dateB = new Date(b[orderBy] as string)
            return dateB.getTime() - dateA.getTime()
        }

        if (b[orderBy] < a[orderBy]) {
            return -1
        }
        if (b[orderBy] > a[orderBy]) {
            return 1
        }
        return 0
    }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key
    ): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string }
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }

    const handleRequestSort = (property: keyof TransactionHistory) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

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

    const filteredAndSortedData = React.useMemo(() => {
        let data = [...historyState];
        
        if (companyFilter) {
            data = data.filter(item => item.company === companyFilter);
        }
        
        if (actionFilter) {
            data = data.filter(item => item.action === actionFilter);
        }
        
        return data.sort(getComparator(order, orderBy));
    }, [historyState, order, orderBy, companyFilter, actionFilter]);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {(companyFilter || actionFilter) && (
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0, 0, 255, 0.05)' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Filtered by:</Typography>
                    {companyFilter && (
                        <Chip 
                            label={`Company: ${companyFilter}`}
                            onDelete={() => setCompanyFilter(null)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                        />
                    )}
                    {actionFilter && (
                        <Chip 
                            label={`Action: ${actionFilter}`}
                            onDelete={() => setActionFilter(null)}
                            color="secondary"
                            size="small"
                            sx={{ mr: 1 }}
                        />
                    )}
                    {(companyFilter && actionFilter) && (
                        <Chip 
                            label="Clear All"
                            onDelete={handleClearFilters}
                            color="default"
                            size="small"
                        />
                    )}
                </Box>
            )}
            
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sortDirection={
                                        orderBy === column.id ? order : false
                                    }
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={
                                            orderBy === column.id
                                                ? order
                                                : 'asc'
                                        }
                                        onClick={() =>
                                            handleRequestSort(column.id)
                                        }
                                    >
                                        {column.label}
                                        {orderBy === column.id ? (
                                            <Box
                                                component="span"
                                                sx={visuallyHidden}
                                            >
                                                {order === 'desc'
                                                    ? 'sorted descending'
                                                    : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedData
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
                                            const value = row[column.id];
                                            
                                            if (column.id === 'company') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        onClick={() => handleCompanyClick(value as string)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            fontWeight: companyFilter === value ? 'bold' : 'normal',
                                                            backgroundColor: companyFilter === value ? 'rgba(0, 0, 255, 0.1)' : 'inherit',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(0, 0, 255, 0.05)'
                                                            }
                                                        }}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                );
                                            }
                                            
                                            if (column.id === 'action') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        onClick={() => handleActionClick(value as string)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            fontWeight: actionFilter === value ? 'bold' : 'normal',
                                                            backgroundColor: actionFilter === value ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(76, 175, 80, 0.05)'
                                                            }
                                                        }}
                                                    >
                                                        {value}
                                                    </TableCell>
                                                );
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
                count={filteredAndSortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default UserHistoryTable
