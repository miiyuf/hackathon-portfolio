import { useState } from 'react'
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

interface TradingActionProps {
    tradingActionModalOpen: boolean
    setTradingActionModalOpen: (open: boolean) => void
}
function TradingAction(props: TradingActionProps) {
    const { tradingActionModalOpen, setTradingActionModalOpen } = props
    const handleOpen = () => {
        setTradingActionModalOpen(true)
    }
    const handleClose = () => {
        setTradingActionModalOpen(false)
    }
    const [action, setAction] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setAction(event.target.value as string)
    }
    const [symbol, setSymbol] = useState('')
    const [quantity, setQuantity] = useState('')
    const [currentPrice, setCurrentPrice] = useState(10)
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
            <Modal open={tradingActionModalOpen} onClose={handleClose}>
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
                            onChange={(e) => setSymbol(e.target.value)}
                            value={symbol}
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
                            {currentPrice * parseInt(quantity || '0')}
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
                        </FormControl>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default TradingAction
