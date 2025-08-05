import React from 'react'
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
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import HistoryIcon from '@mui/icons-material/History'
import { useNavigate } from 'react-router-dom'

function Sidebar() {
    const navigate = useNavigate()
    return (
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
            <List
                sx={{
                    paddingTop: 0,
                }}
            >
                <ListItem
                    key={'dashboard'}
                    disablePadding
                    onClick={() => navigate('/')}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <SpaceDashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Dashboard'} />
                    </ListItemButton>
                </ListItem>
                <ListItem
                    key={'history'}
                    disablePadding
                    onClick={() => navigate('/history')}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={'History'} />
                    </ListItemButton>
                </ListItem>
                <ListItem
                    key={'market'}
                    disablePadding
                    onClick={() => navigate('/Market')}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <AutoGraphIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Market'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}

export default Sidebar
