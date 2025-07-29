import React from 'react'
import UserStocks from '../components/UserStocks'
import {
    Drawer,
    Toolbar,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'

function Home() {
    return (
        <div style={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: 240,
                    flex: 'grow',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    <Typography variant="h4">Portfolio</Typography>
                </Toolbar>
                <Divider />
                <List>
                    {['Dashboard'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <SpaceDashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <UserStocks />
        </div>
    )
}

export default Home
