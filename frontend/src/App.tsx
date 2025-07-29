import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from './components/Sidebar'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Trade from './pages/Trade'
import TradingAction from './components/TradingAction'

function App() {
    const [tradingActionModalOpen, setTradingActionModalOpen] = useState(false)
    const [selectedSymbol, setSelectedSymbol] = useState('')
    return (
        <div className="flex">
            <Sidebar />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            handleTradingAction={setTradingActionModalOpen}
                            handleSymbolSelect={setSelectedSymbol}
                        />
                    }
                />
                <Route path="/trade" element={<Trade />} />
            </Routes>
            <TradingAction
                tradingActionModalOpen={tradingActionModalOpen}
                setTradingActionModalOpen={setTradingActionModalOpen}
                selectedSymbol={selectedSymbol}
                setSelectedSymbol={setSelectedSymbol}
            />
        </div>
    )
}

export default App
