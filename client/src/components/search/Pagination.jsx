import { usePagination } from "react-instantsearch";
import { Box, Button } from '@mui/material';
import { ArrowForward, ArrowBack } from "@mui/icons-material";

export const CustomPagination = () => {

    const {
        currentRefinement,
        nbPages,
        refine,
    } = usePagination();

    const prevButtonSx = {
        minWidth: '36px', 
        bgcolor: currentRefinement >= 1 ? 'darkblue' : 'gray',
        color: 'white',
        '&:hover': {
            bgcolor: 'gray',
        },
        margin: '0 2px'
    };

    const nextButtonSx = {
        minWidth: '36px', 
        bgcolor: currentRefinement < nbPages -1 ? 'darkblue' : 'gray',
        color: 'white',
        '&:hover': {
            bgcolor: 'gray',
        },
        margin: '0 2px'
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', p: '20px' }}>
            <Button
                onClick={() => refine(currentRefinement -1)}
                disabled={currentRefinement < 1}
                sx={prevButtonSx}
            >
                <ArrowBack />
            </Button>
            <Button
                onClick={() => refine(currentRefinement +1)}
                disabled={currentRefinement >= nbPages -1}
                sx={nextButtonSx}
            >
                <ArrowForward />
            </Button>
        </Box>
    );
};