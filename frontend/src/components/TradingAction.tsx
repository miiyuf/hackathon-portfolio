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
import { useTradingContext } from '../GlobalContext'
import {
    fetchCurrentPrice,
    addStockTransaction,
    type StockTransaction,
} from '../api/stocks'

function TradingAction() {
    const { tradingModalState, tradingModalDispatch } = useTradingContext()

    const handleOpen = () => {
        tradingModalDispatch({
            type: 'OPEN_MODAL_WITH_DATA',
            state: { isOpen: true, symbol: '' },
        })
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
            const currentPrice = await fetchCurrentPrice(
                tradingModalState.symbol || ''
            )
            setCurrentPrice(currentPrice.toFixed(2))
        } catch (error) {
            console.error('Error displaying current price:', error)
        }
    }

    const getCurrentPrice = async () => {
        try {
            const currentPrice = await fetchCurrentPrice(
                tradingModalState.symbol || ''
            )
            return currentPrice
        } catch (error) {
            console.error('Error fetching current price:', error)
        }
    }

    const buyStock = async () => {
        try {
            const buyingPrice = await getCurrentPrice()
            const newStock: StockTransaction = {
                symbol: tradingModalState.symbol!,
                purchase_price: buyingPrice!,
                action: 'buy',
                quantity: Number(quantity),
            }
            const res = await addStockTransaction(newStock)
            console.log(res)
        } catch (error) {
            console.log('Error buying stock: ', error)
        } finally {
            handleClose()
        }
    }

    useEffect(() => {
        if (action === 'Buy' || action === 'Sell') {
            setButtonText(action)
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
                                        symbol: e.target.value,
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
                            {Number(currentPrice) * parseInt(quantity || '0')}
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
                                              console.log('sell')
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
