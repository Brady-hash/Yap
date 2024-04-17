import { Button, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';

export const SearchBtn = ({ setSearchOpen, sx }) => {
    const { theme } = useThemeContext();
    return (
        <>
        <Button 
            variant='contained' 
            onClick={() => setSearchOpen(true)} 
            sx={{ 
                height: '50px', 
                bgcolor: theme.palette.primary.main, 
                '&:hover': { bgcolor: theme.palette.secondary.main}
             }}
        >
            <Typography variant='h7'>Discover</Typography>
            <Search sx={{fontSize: 30, color: 'white', marginLeft: 1}}/>
        </Button>
        </>
    )
};