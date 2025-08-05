import { useState } from 'react'
import Sidebar from './components/Sidebar'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Market from './pages/Market'
import TradingAction from './components/TradingAction'
import History from './pages/History'

function App() {
    return (
        <div className="flex">
            <Sidebar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
                <Route path="/market" element={<Market />} />
            </Routes>
            <TradingAction />
        </div>
    )
}

export default App
