import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
    type SelectChangeEvent,
} from '@mui/material'
import { useTradingContext } from '../contexts/TradingContext'
import {
    fetchCurrentPrice,
    fetchHoldingsQuantity,
    addStockTransaction,
    type StockTransaction,
} from '../api/stocks'
import { useSelectedStockContext } from '../contexts/SelectedStockContext'
import { updateUserStocks } from '../contexts/UserStocksContext'
import { useUserStocksContext } from '../contexts/UserStocksContext'
import { useHistoryContext } from '../contexts/HistoryContext'
import { fetchTransactionHistory } from '../contexts/HistoryContext'
import {
    updatePortfolioBalance,
    updatePortfolioInvestment,
    usePortfolioInfoContext,
} from '../contexts/PortfolioInfoContext'

function TradingAction() {
    const { tradingModalState, tradingModalDispatch } = useTradingContext()
    const { userStocksState, userStocksDispatch } = useUserStocksContext()

    const { selectedStockState, selectedStockDispatch } =
        useSelectedStockContext()
    const { portfolioInfoState, portfolioInfoDispatch } =
        usePortfolioInfoContext()
    const { historyState, historyDispatch } = useHistoryContext()

    const handleOpen = () => {
        tradingModalDispatch({
            type: 'OPEN_MODAL_WITH_DATA',
            state: {
                isOpen: true,
                symbol: selectedStockState.selectedStock || '',
            },
        })
        if (selectedStockState.selectedStock !== '') {
            displaySymbolPrice(selectedStockState.selectedStock)
        }
    }
    const handleClose = () => {
        setAction('')
        setQuantity('')
        setCurrentPrice('')
        tradingModalDispatch({
            type: 'CLOSE_MODAL',
        })
    }
    const [action, setAction] = useState('')
    const [buttonText, setButtonText] = useState('Buy / Sell')

    const handleChange = (event: SelectChangeEvent) => {
        setAction(event.target.value as string)
    }
    const [quantity, setQuantity] = useState('')
    const [currentPrice, setCurrentPrice] = useState('')

    // fetch current price once user clicks out of stock symbol field
    const displayCurrentPrice = async () => {
        try {
            const currentPrice = await getCurrentPrice(
                tradingModalState.symbol || ''
            )
            if (currentPrice) {
                setCurrentPrice(currentPrice.toFixed(2))
            }
        } catch (error) {
            console.error('Error displaying current price:', error)
        }
    }

    const displaySymbolPrice = async (symbol: string) => {
        try {
            const currentPrice = await getCurrentPrice(symbol)
            if (currentPrice) {
                setCurrentPrice(currentPrice.toFixed(2))
            }
        } catch (error) {
            console.error('Error displaying current price:', error)
        }
    }

    const getCurrentPrice = async (symbol: string) => {
        try {
            const currentPrice = await fetchCurrentPrice(symbol)
            return currentPrice
        } catch (error) {
            console.error('Error fetching current price:', error)
        }
    }

    const getHoldingQuantity = async (symbol: string) => {
        try {
            const holdingsQuantity = await fetchHoldingsQuantity(symbol)
            return holdingsQuantity
        } catch (error) {
            console.error('Error fetching holdings quantity:', error)
            return 0
        }
    }

    const buyStock = async () => {
        try {
            const buyingPrice = await getCurrentPrice(
                tradingModalState.symbol || ''
            )
            if (tradingModalState.symbol && buyingPrice) {
                const newStock: StockTransaction = {
                    symbol: tradingModalState.symbol!,
                    purchase_price: buyingPrice!,
                    action: 'buy',
                    quantity: Number(quantity),
                }
                const res = await addStockTransaction(newStock)
            } else {
                alert('Please enter all fields')
                return
            }
        } catch (error) {
            console.log('Error buying stock: ', error)
        } finally {
            // update total portfolio balance & investment
            updatePortfolioBalance(portfolioInfoDispatch)
            updatePortfolioInvestment(portfolioInfoDispatch)
            // update user stocks
            updateUserStocks(userStocksDispatch)
            // update history
            fetchTransactionHistory(historyDispatch)

            handleClose()
        }
    }

    const sellStock = async () => {
        try {
            const sellingPrice = await getCurrentPrice(
                tradingModalState.symbol || ''
            )
            const holdingQuantity = await getHoldingQuantity(
                tradingModalState.symbol || ''
            )
            if (Number(quantity) > holdingQuantity) {
                alert(`You cannot sell more than you own. You currently own ${holdingQuantity} shares of ${tradingModalState.symbol}.`)
                return
            }
            
            console.log('selling price:', sellingPrice)
            if (tradingModalState.symbol && sellingPrice) {
                const newStock: StockTransaction = {
                    symbol: tradingModalState.symbol!,
                    purchase_price: sellingPrice!,
                    action: 'sell',
                    quantity: Number(quantity),
                }
                const res = await addStockTransaction(newStock)
                console.log('Sell stock response:', res)
            } else {
                alert('Unable to fetch current price for selling')
                return
            }
        } catch (error) {
            console.log('Error selling stock: ', error)
            alert(
                'An error occurred while selling the stock. Please try again.'
            )
        } finally {
            // update total portfolio balance & investment
            updatePortfolioBalance(portfolioInfoDispatch)
            updatePortfolioInvestment(portfolioInfoDispatch)
            // update user stocks
            updateUserStocks(userStocksDispatch)
            // update history
            fetchTransactionHistory(historyDispatch)
            handleClose()
        }
    }

    useEffect(() => {
        if (action === 'Buy' || action === 'Sell') {
            setButtonText(action)
        } else {
            setButtonText('Buy / Sell')
        }
    }, [action])

    return (
        <div>
            <Button
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    margin: 4,
                    backgroundColor: '#7cbf8e',
                    '&:focus': {
                        outline: '2px solid #7cbf8e', // custom border color
                        outlineOffset: '2px',
                    },
                }}
                onClick={handleOpen}
                variant="contained"
            >
                Buy / Sell
            </Button>
            <Modal open={tradingModalState.isOpen} onClose={handleClose}>
                <Box
                    sx={{
                        width: 400,
                        margin: 'auto',
                        marginTop: '20vh',
                        padding: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 15,
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Buy / Sell Stocks
                        </Typography>
                        <TextField
                            required
                            label="Stock Symbol"
                            placeholder="ex: AAPL"
                            onChange={(e) =>
                                tradingModalDispatch({
                                    type: 'UPDATE_MODAL_SYMBOL',
                                    state: {
                                        isOpen: true,
                                        symbol: e.target.value.toUpperCase(),
                                    },
                                })
                            }
                            onBlur={displayCurrentPrice}
                            value={tradingModalState.symbol}
                        ></TextField>
                        <TextField
                            required
                            label="Quantity"
                            placeholder="ex: 10"
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                        ></TextField>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            current price: ${currentPrice}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            estimated total price: $
                            {(
                                Number(currentPrice) * parseInt(quantity || '0')
                            ).toFixed(2)}
                        </Typography>
                        <FormControl variant="standard">
                            <InputLabel id="action">Action</InputLabel>
                            <Select
                                labelId="action"
                                id="action-select"
                                value={action}
                                label="Action"
                                onChange={handleChange}
                            >
                                <MenuItem value={'Buy'}>Buy</MenuItem>
                                <MenuItem value={'Sell'}>Sell</MenuItem>
                            </Select>
                            <Button
                                sx={{
                                    margin: 4,
                                    backgroundColor: '#7cbf8e',
                                    '&:focus': {
                                        outline: '2px solid #7cbf8e', // custom border color
                                        outlineOffset: '2px',
                                    },
                                }}
                                onClick={
                                    action === 'Buy'
                                        ? buyStock
                                        : () => {
                                              sellStock()
                                          }
                                }
                                variant="contained"
                            >
                                {`${buttonText}`}
                            </Button>
                        </FormControl>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default TradingAction
