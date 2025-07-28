import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from '@material-tailwind/react'

function Sidebar() {
    return (
        <Card className="absolute top-0 left-0 flex flex-col h-[calc(100vh-2rem)] h-full w-full max-w-[17rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
                <Typography
                    className="font-semibold text-left text-2xl pb-10"
                    color="blue-gray"
                >
                    Portfolio
                </Typography>
            </div>
            <List>
                <ListItem className="h-13 pl-4">Dashboard</ListItem>
                <ListItem className="h-13 pl-4">Profile</ListItem>
                <ListItem className="h-13 pl-4">Settings</ListItem>
                <ListItem className="h-13 pl-4">Log Out</ListItem>
            </List>
        </Card>
    )
}

export default Sidebar
