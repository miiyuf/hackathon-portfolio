import React from 'react'
import UserStocksTable from '../components/UserStocksTable'
interface HomeProps {
    handleTradingAction: (open: boolean) => void
}
function Home(props: HomeProps) {
    const { handleTradingAction } = props
    return (
        <div style={{ display: 'flex', marginLeft: 240 }}>
            <UserStocksTable handleTradingAction={handleTradingAction} />
        </div>
    )
}

export default Home
