import React from 'react'
import UserHistoryTable from '../components/UserHistoryTable'
import { Typography } from '@mui/material'

function History() {
    return (
        <div style={{ marginLeft: 240 }}>
            <Typography variant="h5">History</Typography>
            <UserHistoryTable />
        </div>
    )
}

export default History
