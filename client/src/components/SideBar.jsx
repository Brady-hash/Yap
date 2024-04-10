import { useState } from "react";
import { Box, Drawer, Button, Avatar, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import LogoutBtn from '../components/btns/LogoutBtn';
import MyProfileBtn from '../components/btns/MyProfileBtn';
import { SearchBtn } from "./btns/SearchBtn";
import { SearchForm } from "./forms/SearchForm";

export const SideBar = ({ sideBarToggled }) => {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <Drawer
            variant="temporary"
            anchor="right"
            open={sideBarToggled}
            sx={{
                width: 240, 
                flexShrink: 0, 
                '& .MuiDrawer-paper': {
                    width: '34%', 
                    boxSizing: 'border-box', 
                    border: 'solid #444 2px', 
                    bgcolor: '#333',
                },
            }}
        >
            <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column'}}>
                <Avatar 
                    src="/Yap-Logo.png"
                    sx={{
                        width: 'auto',
                        height: '20%',
                        maxWidth: 250,
                        maxHeight: 250,
                        margin: '0 auto',  
                        display: 'block',  
                    }}
                />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',marginLeft:.25, marginRight:.25}}>
                    <MyProfileBtn sx={{ marginBottom: 1, bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a' }}} />
                    <SearchBtn setSearchOpen={setSearchOpen} sx={{ marginBottom: 1, bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a' }}} searchOpen={searchOpen} />
                    <Button sx={{ marginBottom: 1, bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a' }}}>
                        <Typography variant='h7' sx={{ color: "white" }}>Settings</Typography>
                        <Settings sx={{ fontSize: 30, color: "white", marginLeft: 1 }}/>
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <LogoutBtn sx={{ bgcolor: '#be3144', '&:hover': { bgcolor: '#e84a5f' } }} />
                </Box>
                {searchOpen && <SearchForm searchOpen={searchOpen} setSearchOpen={setSearchOpen} />}
            </Box>
        </Drawer>
    );
}
