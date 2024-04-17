import { useState, useEffect } from 'react';
import { Box, Button, Switch, FormControlLabel, useTheme } from '@mui/material';
import { ModeNight, Brightness7 } from '@mui/icons-material';
import MyProfileBtn from './btns/MyProfileBtn';
import LogoutBtn from './btns/LogoutBtn';
import { LogoBtn } from './btns/LogoBtn';
import { SearchBtn } from './btns/SearchBtn';
import { SearchForm } from "./forms/SearchForm";
import { SideBarBtn } from './btns/SideBarBtn';
import { ToggleThemeBtn } from './btns/ToggleThemeBtn';
import { useThemeContext } from '../context/ThemeContext';

export const NavBar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const { theme, isDarkMode } = useThemeContext();
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
        <>
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
            {isSmallScreen ? 
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', px: 1}}>
                <LogoBtn />
                <SideBarBtn />
            </Box> 
            :
            <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 5, alignItems: 'center'}}>
                <LogoutBtn/>
                <MyProfileBtn />
                <LogoBtn />
                <SearchBtn setSearchOpen={setSearchOpen}/>
                {/* <FormControlLabel
                    control={
                        <Switch
                        disableRipple
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        icon={<Brightness7 sx={{ color: 'yellow', transform: 'translateY(-6.5px) translateX(-5px)', fontSize: 35, boxShadow: 'none'}}/>}
                        checkedIcon={<ModeNight sx={{ color: '#bae8e8',transform: 'translateY(-6.5px) translateX(3px)', fontSize: 35 }}/>}
                        sx={{
                            height: '40px',
                            width: '70px',
                            '& .MuiSwitch-switchBase': {
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none'
                                },
                                '&.Mui-checked:hover': {
                                    backgroundColor: 'transparent',
                                }
                                },
                                '& .MuiSwitch-track': {
                                    transition: 'none' 
                                }
                            }}
                        />
                    }
                    sx={{ position: 'relative' }}
                    labelPlacement="start"
                /> */}
                <ToggleThemeBtn />
            </Box>
            </>
             }
            {searchOpen && <SearchForm searchOpen={searchOpen} setSearchOpen={setSearchOpen}/>}
        </Box>
        </>
    )
};