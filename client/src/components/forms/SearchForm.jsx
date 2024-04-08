import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Backdrop, Box, Typography } from '@mui/material';
import { Close } from "@mui/icons-material";
import { Search } from "../search/Search";

export const SearchForm = ({ searchOpen, setSearchOpen }) => {
    const [tabIndex, setTabIndex] = useState('usersIndex');
    const activeSX = {
        bgcolor: 'darkblue', 
        color: 'white', 
        py: 1, 
        px: 2, 
        borderRadius: 2, 
        cursor: 'pointer',
        boxShadow: '10px 10px 10px rgb(0, 0, 0, 0.3)',
        '&:hover': {
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
        },
        transition: 'all 0.3s ease-in-out'
    };
    
    const inactiveSX = {
        bgcolor: 'gray', 
        color: 'white', 
        py: 1, 
        px: 2, 
        borderRadius: 2, 
        cursor: 'pointer'
    };

    return (
        <>
        <Dialog 
            open={searchOpen}
            // onClose={}
            sx={{ overflow: 'auto', height: '100%' }}
        >
            <Close 
                sx={{fontSize: 40, color: 'white', position: 'absolute', top: 5, left: 5}}
                onClick={() => setSearchOpen(false)}
            />
            <Box sx={{ width: '380px', height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#444'}}>
            <DialogTitle sx={{ bgcolor: '#777', boxShadow: 5,width: '100%', textAlign: 'center'}}>Find Users or Threads</DialogTitle>
            <DialogContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', my: 2}}>
                    <Typography 
                        variant='h5' 
                        sx= {tabIndex === 'usersIndex' ? activeSX: inactiveSX}
                        onClick={() => setTabIndex('usersIndex')}
                    >
                        Users
                    </Typography>
                    <Typography 
                        variant='h5' 
                        sx= {tabIndex === 'threadsIndex' ? activeSX: inactiveSX}
                        onClick={() => setTabIndex('threadsIndex')}
                    >
                        Threads
                    </Typography>
                </Box>
                <Search tabIndex={tabIndex}/>
            </DialogContent>
            </Box>
        </Dialog>
        </>
    )
};