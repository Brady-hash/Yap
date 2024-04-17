import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import MyProfileBtn from './btns/MyProfileBtn';
import LogoutBtn from './btns/LogoutBtn';
import { LogoBtn } from './btns/LogoBtn';
import { SearchBtn } from './btns/SearchBtn';
import { SearchForm } from "./forms/SearchForm";
import { SideBarBtn } from './btns/SideBarBtn';
import { ToggleThemeBtn } from './btns/ToggleThemeBtn';
import { useThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';

export const NavBar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const { theme, isDarkMode } = useThemeContext();
    const { authUser } = useAuthContext();
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowWidth]);
  
    const isSmallScreen = windowWidth < 1000;

    return (
        <Box
            sx={{
                zIndex: 100,
                width: '100%',
                height: '100px',
                position: 'fixed',
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                top: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: isDarkMode
                    ? 'linear-gradient(to bottom, #333333, #1a1a1a)'
                    : 'linear-gradient(to bottom, #98FB98, #87CEEB)',
                boxShadow: '0px 15px 10px 0px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)'
            }}
        >
            {authUser ? (
                isSmallScreen ? (
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            width: '100%', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            px: 1 
                        }}
                    >
                        <LogoBtn />
                        <SideBarBtn />
                    </Box>
                ) : (
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            width: '100%', 
                            px: 5, 
                            alignItems: 'center' 
                        }}
                    >
                        <LogoutBtn />
                        <MyProfileBtn />
                        <LogoBtn />
                        <SearchBtn setSearchOpen={setSearchOpen} />
                        <ToggleThemeBtn />
                    </Box>
                )
            ) : (
                <Box 
                    sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent:'space-between', 
                        px: 2
                    }}
                >
                    <LogoBtn />
                    <Button
                        variant="contained"
                        sx={{ 
                            height: '50px',
                            bgcolor: theme.palette.primary.main,
                            '&:hover': { bgcolor: theme.palette.secondary.main }
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Login / Sign Up
                    </Button>
                </Box>
            )}
            {searchOpen && <SearchForm searchOpen={searchOpen} setSearchOpen={setSearchOpen} />}
        </Box>
    );
};