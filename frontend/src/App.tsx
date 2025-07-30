import { useState } from 'react'
import Sidebar from './components/Sidebar'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Trade from './pages/Trade'
import TradingAction from './components/TradingAction'
import History from './pages/History'

function App() {
    return (
        <div className="flex">
            <Sidebar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/history" element={<History />} />
            </Routes>
            <TradingAction />
        </div>
    )
}

export default App
