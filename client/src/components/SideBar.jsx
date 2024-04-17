import { useState } from "react";
import { Box, Drawer, Button, Avatar, Typography, useTheme } from "@mui/material";
import { Settings, Close } from "@mui/icons-material";
import LogoutBtn from '../components/btns/LogoutBtn';
import MyProfileBtn from '../components/btns/MyProfileBtn';
import { SearchBtn } from "./btns/SearchBtn";
import { SearchForm } from "./forms/SearchForm";
import { ToggleThemeBtn } from "./btns/ToggleThemeBtn";
import { useThemeContext } from "../context/ThemeContext";
import logoSrc from '../images/Yap-Logo.png';

export const SideBar = ({ sideBarToggled, onClose }) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const { theme } = useThemeContext();

    return (
        <Drawer
            variant="temporary"
            anchor="right"
            open={sideBarToggled}
            sx={{
                width: 240, 
                flexShrink: 0, 
                '& .MuiDrawer-paper': {
                    width: '40%', 
                    boxSizing: 'border-box', 
                    border: 'solid #444 2px', 
                    bgcolor: '#333',
                },
            }}
        >
            <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column'}}>
                <Avatar 
                    src={logoSrc}
                    sx={{
                        width: 'auto',
                        height: '20%',
                        maxWidth: 250,
                        maxHeight: 250,
                        margin: '0 auto',  
                        display: 'block',  
                    }}
                />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <MyProfileBtn sx={{ marginBottom: 1, bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a' }}} />
                    <SearchBtn setSearchOpen={setSearchOpen} sx={{ marginBottom: 1, bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a' }}} searchOpen={searchOpen} />
                    <Button sx={{ marginBottom: 1, bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a' }}}>
                        <Typography variant='h7' sx={{ color: "white" }}>Settings</Typography>
                        <Settings sx={{ fontSize: 30, color: "white", marginLeft: 1 }}/>
                    </Button>
                    <Box sx={{ flexGrow: 1, }} />
                        <ToggleThemeBtn sx={{ position: 'absolute', transform: 'translateY(-30px)', left: 0}}/>
                        <LogoutBtn sx={{ bgcolor: '#be3144', '&:hover': { bgcolor: '#e84a5f' } }} />
                    </Box>
                {searchOpen && <SearchForm searchOpen={searchOpen} setSearchOpen={setSearchOpen} />}
            </Box>
            <Close 
                onClick={() => onClose(false)}
                sx={{ 
                    fontSize: 35,
                    cursor: 'pointer', 
                    transition: '0.1s ease-in-out', 
                    position: 'absolute', 
                    top: 12, 
                    left: 10, 
                    color: theme.palette.utility.main,
                    '&:hover': { color: theme.palette.utility.secondary } 
                }}
            />
        </Drawer>
    );
}
