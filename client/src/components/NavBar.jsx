import { useState } from 'react';
import { Box } from '@mui/material';
import MyProfileBtn from './btns/MyProfileBtn';
import LogoutBtn from './btns/LogoutBtn';
import { SearchBtn } from './btns/SearchBtn';
import { SearchForm } from "./forms/SearchForm";


export const NavBar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    return (
        <>
        <Box sx={{ zIndex: 100, width: '100%', height: '75px',position: 'fixed', top: 0, right: 0, display: 'flex', justifyContent: 'flex-end', gap: 10, alignItems: 'center', px: 3}}>
            <MyProfileBtn sx={{ bgcolor: '#222831', right: 10, '&:hover': { bgcolor: '#455d7a' }}}/>
            <SearchBtn sx={{ bgcolor: '#222831', right: 10, '&:hover': { bgcolor: '#455d7a'} }} setSearchOpen={setSearchOpen}/>
            <LogoutBtn sx={{ position: 'absolute', left: 25, marginLeft: 2, bgcolor: '#be3144', '&:hover': { bgcolor: '#e84a5f' } }}/>
        </Box>
        {searchOpen && <SearchForm searchOpen={searchOpen} setSearchOpen={setSearchOpen}/>}
        </>
    )
};