import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Search, ThreeP } from '@mui/icons-material';

export const SearchBtn = ({ setSearchOpen, sx }) => {
    return (
        <>
        <Button 
            variant='contained' 
            onClick={() => setSearchOpen(true)} 
            sx={sx}
        >
            <Typography variant='h7'>Discover</Typography>
            <Search sx={{fontSize: 30, color: 'white', marginLeft: 1}}/>
        </Button>
        </>
    )
};