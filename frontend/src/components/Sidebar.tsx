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
            <List>
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
                    key={'trade'}
                    disablePadding
                    onClick={() => navigate('/trade')}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <AutoGraphIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Trade'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}

export default Sidebar
