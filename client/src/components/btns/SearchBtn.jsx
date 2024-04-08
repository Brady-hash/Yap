import { useState } from 'react';
import { Button } from '@mui/material';
import { Search } from '@mui/icons-material';

export const SearchBtn = ({ setSearchOpen, searchOpen }) => {
    // const [searchOpen, setSearchOpen] = useState(false)
    return (
        <>
        <Button onClick={() => setSearchOpen(true)}>
            <Search/>
        </Button>
        </>
    )
};