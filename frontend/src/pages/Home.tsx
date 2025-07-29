import React from 'react'
import UserStocksTable from '../components/UserStocksTable'
interface HomeProps {
    handleTradingAction: (open: boolean) => void
    handleSymbolSelect: (symbol: string) => void
}
function Home(props: HomeProps) {
    const { handleTradingAction, handleSymbolSelect } = props
    return (
        <div style={{ display: 'flex', marginLeft: 240 }}>
            <UserStocksTable
                handleTradingAction={handleTradingAction}
                handleSymbolSelect={handleSymbolSelect}
            />
        </div>
    )
}

export default Home
