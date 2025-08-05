import * as React from 'react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { alpha } from '@mui/material/styles'
import { useSelectedStockContext } from '../contexts/SelectedStockContext'
import { useTradingContext } from '../contexts/TradingContext'
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    Skeleton,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { useUserStocksContext } from '../contexts/UserStocksContext'
import { type UserStockState } from '../contexts/UserStocksContext'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

type Order = 'asc' | 'desc'

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

interface HeadCell {
    disablePadding: boolean
    id: keyof UserStockState
    label: string
    numeric: boolean
}

const headCells: readonly HeadCell[] = [
    {
        id: 'ticker',
        numeric: false,
        disablePadding: false,
        label: 'Ticker',
    },
    {
        id: 'stockName',
        numeric: false,
        disablePadding: false,
        label: 'Stock Name',
    },
    {
        id: 'qty',
        numeric: true,
        disablePadding: false,
        label: 'Quantity',
    },
    {
        id: 'costPrice',
        numeric: true,
        disablePadding: false,
        label: 'Cost Price ($)',
    },
    {
        id: 'currentPrice',
        numeric: true,
        disablePadding: false,
        label: 'Current Price ($)',
    },
    {
        id: 'profitLoss',
        numeric: true,
        disablePadding: false,
        label: 'Profit / Loss ($)',
    },
]

interface EnhancedTableProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof UserStockState
    ) => void
    order: Order
    orderBy: string
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props
    const createSortHandler =
        (property: keyof UserStockState) =>
        (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property)
        }

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
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
    )
}

interface EnhancedTableToolbarProps {
    numSelected: number
    handleUserOpen: () => void
    selectedSymbol: string
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, handleUserOpen, selectedSymbol } = props
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {selectedSymbol} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Your Holdings
                </Typography>
            )}
        </Toolbar>
    )
}

export default function UserStocksTable() {
    // const { handleStockSelection } = props
    const { selectedStockState, selectedStockDispatch } =
        useSelectedStockContext()
    const [order, setOrder] = React.useState<Order>('asc')
    const [orderBy, setOrderBy] = React.useState<keyof UserStockState>('ticker')
    const [selectedId, setSelectedId] = useState(-1)
    const [page, setPage] = React.useState(0)
    const [dense, setDense] = React.useState(false)
    const [rowsPerPage, setRowsPerPage] = React.useState(3)
    const { userStocksState, userStocksDispatch } = useUserStocksContext()

    const { tradingModalState, tradingModalDispatch } = useTradingContext()
    const handleUserOpen = () => {
        tradingModalDispatch({
            type: 'OPEN_MODAL_WITH_DATA',
            state: { isOpen: true, symbol: selectedStockState.selectedStock },
        })
    }

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof UserStockState
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedRow = userStocksState.find((row) => row.id === id)
        if (id === selectedId) {
            setSelectedId(-1)
            selectedStockDispatch({
                type: 'RESET_STOCK',
            })
        } else {
            setSelectedId(id)
            selectedStockDispatch({
                type: 'SELECT_STOCK',
                state: { selectedStock: selectedRow ? selectedRow.ticker : '' },
            })
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - userStocksState.length)
            : 0

    const visibleRows = React.useMemo(
        () =>
            [...userStocksState]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, userStocksState]
    )

    return (
        <Box sx={{ width: '100%', paddingTop: 3 }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selectedId === -1 ? 0 : 1}
                    handleUserOpen={handleUserOpen}
                    selectedSymbol={selectedStockState.selectedStock}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 700 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows.length > 0
                                ? visibleRows.map((row, index) => {
                                      const labelId = `enhanced-table-checkbox-${index}`

                                      return (
                                          <TableRow
                                              hover
                                              onClick={(event) =>
                                                  handleClick(event, row.id)
                                              }
                                              role="checkbox"
                                              tabIndex={-1}
                                              key={row.id}
                                              selected={selectedId === row.id}
                                              sx={{ cursor: 'pointer' }}
                                          >
                                              <TableCell
                                                  component="th"
                                                  id={labelId}
                                                  scope="row"
                                                  align="left"
                                              >
                                                  {row.ticker}
                                              </TableCell>
                                              <TableCell align="left">
                                                  {row.stockName}
                                              </TableCell>
                                              <TableCell align="right">
                                                  {row.qty}
                                              </TableCell>
                                              <TableCell align="right">
                                                  {row.costPrice}
                                              </TableCell>
                                              <TableCell align="right">
                                                  {Number(
                                                      row.currentPrice
                                                  ).toFixed(2)}
                                              </TableCell>
                                              <TableCell align="right">
                                                  {row.profitLoss}
                                              </TableCell>
                                          </TableRow>
                                      )
                                  })
                                : Array.from(new Array(3)).map((_, index) => (
                                      <TableRow key={index}>
                                          <TableCell component="th">
                                              <Skeleton />
                                          </TableCell>
                                          <TableCell align="left">
                                              <Skeleton />
                                          </TableCell>
                                          <TableCell align="right">
                                              <Skeleton />
                                          </TableCell>
                                          <TableCell align="right">
                                              <Skeleton />
                                          </TableCell>
                                          <TableCell align="right">
                                              <Skeleton />
                                          </TableCell>
                                          <TableCell align="right">
                                              <Skeleton />
                                          </TableCell>
                                      </TableRow>
                                  ))}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[3, 5, 10, 25]}
                    component="div"
                    count={userStocksState.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}
