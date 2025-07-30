import React from 'react'
import UserHistoryTable from '../components/UserHistoryTable'
import { Typography } from '@mui/material'
import './Home.css'

function History() {
    return (
        <div className="internal-tab">
            <Typography variant="h5">History</Typography>
            <UserHistoryTable />
        </div>
    )
}

export default History
