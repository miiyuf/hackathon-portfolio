import React, { useState, useEffect } from 'react'
import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography,
    CircularProgress,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert
} from '@mui/material'
import { API } from '../api/stocks'
import TableSortLabel from '@mui/material/TableSortLabel';


interface StockData {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
}

type TransactionType = 'buy' | 'sell'

function Market() {
    const [stocks, setStocks] = useState<StockData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null)
    const [transactionType, setTransactionType] = useState<TransactionType>('buy')
    const [quantity, setQuantity] = useState<number>(0)
    const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false)
    const [notification, setNotification] = useState<{
        open: boolean,
        message: string,
        severity: 'success' | 'error' | 'info'
    }>({
        open: false,
        message: '',
        severity: 'info'
    })

    const [sortConfig, setSortConfig] = useState<{ key: keyof StockData, direction: 'asc' | 'desc' } | null>(null)

    const sortedStocks = React.useMemo(() => {
    if (!sortConfig) return stocks

    const sorted = [...stocks].sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortConfig.direction === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
        }

        return 0
    })

    return sorted
}, [stocks, sortConfig])

    const handleSort = (key: keyof StockData) => {
    setSortConfig(prev => {
        if (prev?.key === key) {
            return {
                key,
                direction: prev.direction === 'asc' ? 'desc' : 'asc'
            }
        }
        return { key, direction: 'asc' }
    })
}



    useEffect(() => {
        const fetchTopStocks = async () => {
            try {
                setLoading(true)
                const response = await API.get('/api/japan_stocks')
                
                if (Array.isArray(response.data)) {
                    setStocks(response.data)
                } else if (response.data && typeof response.data === 'object') {
                    if (Array.isArray(response.data.data)) {
                        setStocks(response.data.data)
                    } else if (Array.isArray(response.data.results)) {
                        setStocks(response.data.results)
                    } else {
                        console.error('Unexpected API response format:', response.data)
                        setStocks([])
                        setError('Invalid data format received from server')
                    }
                } else {
                    console.error('Unexpected API response type:', response.data)
                    setStocks([])
                    setError('Invalid response from server')
                }
            } catch (err) {
                console.error('Error fetching top stocks:', err)
                
                if (err.response) {
                    console.error('Error response:', err.response.status, err.response.data)
                } else if (err.request) {
                    console.error('Error request:', err.request)
                }
                
                setError('Failed to load stock data')
                setStocks([])
            } finally {
                setLoading(false)
            }
        }

        fetchTopStocks()
    }, [])

    const getChangeColor = (change: number) => {
        return change >= 0 ? 'success.main' : 'error.main'
    }

    const handleOpenTransactionModal = (stock: StockData, type: TransactionType) => {
        setSelectedStock(stock)
        setTransactionType(type)
        setQuantity(0)
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedStock(null)
    }

    const handleExecuteTransaction = async () => {
        if (!selectedStock || quantity <= 0) return
        
        try {
            setTransactionInProgress(true)
            
            const response = await API.post('/api/stocks', {
                symbol: selectedStock.symbol,
                action: transactionType,
                quantity: quantity
            })
            
            setNotification({
                open: true,
                message: `Successfully ${transactionType === 'buy' ? 'purchased' : 'sold'} ${quantity} shares of ${selectedStock.symbol}`,
                severity: 'success'
            })
            
            handleCloseModal()
        } catch (err) {
            console.error('Transaction error:', err)
            
            setNotification({
                open: true,
                message: `Transaction failed: ${err.response?.data?.message || 'Unknown error'}`,
                severity: 'error'
            })
        } finally {
            setTransactionInProgress(false)
        }
    }

    const handleCloseNotification = () => {
        setNotification({...notification, open: false})
    }

    return (
        <div className="internal-tab">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                TOPIX Large70
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="stock market table">
                        <TableHead>
                            <TableRow>
                                
                                <TableCell sortDirection={sortConfig?.key === 'symbol' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'symbol'}
                                    direction={sortConfig?.key === 'symbol' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('symbol')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Symbol
                                </TableSortLabel>
                                </TableCell>

                                <TableCell sortDirection={sortConfig?.key === 'name' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'name'}
                                    direction={sortConfig?.key === 'name' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('name')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Company
                                </TableSortLabel>
                                </TableCell>

                                <TableCell align="right" sortDirection={sortConfig?.key === 'price' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'price'}
                                    direction={sortConfig?.key === 'price' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('price')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Price ($)
                                </TableSortLabel>
                                </TableCell>

                                <TableCell align="right" sortDirection={sortConfig?.key === 'change' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'change'}
                                    direction={sortConfig?.key === 'change' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('change')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Change
                                </TableSortLabel>
                                </TableCell>

                                <TableCell align="right" sortDirection={sortConfig?.key === 'changePercent' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'changePercent'}
                                    direction={sortConfig?.key === 'changePercent' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('changePercent')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Change %
                                </TableSortLabel>
                                </TableCell>

                                <TableCell align="right" sortDirection={sortConfig?.key === 'volume' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'volume'}
                                    direction={sortConfig?.key === 'volume' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('volume')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Volume
                                </TableSortLabel>
                                </TableCell>

                                <TableCell align="center">
                                Actions
                                </TableCell>
                                                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(stocks) && stocks.length > 0 ? (
                                sortedStocks.map((stock) => (
                                    <TableRow
                                        key={stock.symbol}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <strong>{stock.symbol}</strong>
                                        </TableCell>
                                        <TableCell>{stock.name}</TableCell>
                                        <TableCell align="right">{stock.price.toFixed(2)}</TableCell>
                                        <TableCell 
                                            align="right"
                                            sx={{ color: getChangeColor(stock.change) }}
                                        >
                                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                                        </TableCell>
                                        <TableCell 
                                            align="right"
                                            sx={{ color: getChangeColor(stock.changePercent) }}
                                        >
                                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align="right">{stock.volume.toLocaleString()}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                <Button 
                                                    size="small" 
                                                    variant="contained" 
                                                    color="success" 
                                                    onClick={() => handleOpenTransactionModal(stock, 'buy')}
                                                >
                                                    Buy
                                                </Button>
                                                <Button 
                                                    size="small" 
                                                    variant="contained" 
                                                    color="error"
                                                    onClick={() => handleOpenTransactionModal(stock, 'sell')}
                                                >
                                                    Sell
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No stock data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>
                    {transactionType === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.symbol}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="body1">
                            Company: <strong>{selectedStock?.name}</strong>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Current Price: <strong>${selectedStock?.price.toFixed(2)}</strong>
                        </Typography>
                        
                        <TextField
                            label="Quantity"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            InputProps={{ inputProps: { min: 1 } }}
                        />
                        
                        {quantity > 0 && selectedStock && (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Total: <strong>${(quantity * selectedStock.price).toFixed(2)}</strong>
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color={transactionType === 'buy' ? 'success' : 'error'}
                        disabled={!quantity || quantity <= 0 || transactionInProgress}
                        onClick={handleExecuteTransaction}
                    >
                        {transactionInProgress ? 'Processing...' : transactionType === 'buy' ? 'Buy Shares' : 'Sell Shares'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Market
