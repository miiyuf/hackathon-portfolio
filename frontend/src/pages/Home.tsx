import React from 'react'
import UserStocksTable from '../components/UserStocksTable'
import './Home.css'

interface HomeProps {
    handleTradingAction: (open: boolean) => void
    handleSymbolSelect: (symbol: string) => void
}
function Home(props: HomeProps) {
    const { handleTradingAction, handleSymbolSelect } = props
    return (
        <div className="internal-tab">
            <UserStocksTable
                handleTradingAction={handleTradingAction}
                handleSymbolSelect={handleSymbolSelect}
            />
        </div>
    )
}

export default Home
