import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from './components/Sidebar'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Trade from './pages/Trade'
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
import React from 'react'
import TradingAction from './components/TradingAction'

function App() {
    const [tradingActionModalOpen, setTradingActionModalOpen] = useState(false)
    return (
        <div className="flex">
            <Sidebar />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home handleTradingAction={setTradingActionModalOpen} />
                    }
                />
                <Route path="/trade" element={<Trade />} />
            </Routes>
            <TradingAction
                tradingActionModalOpen={tradingActionModalOpen}
                setTradingActionModalOpen={setTradingActionModalOpen}
            />
        </div>
    )
}

export default App
