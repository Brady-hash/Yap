import { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useSearchBox } from 'react-instantsearch';

export const CustomSearchBox = ({ onSearch, tabIndex }) => {
    const { query, refine } = useSearchBox();
    const [currentSearch, setCurrentSearch] = useState('');
    const searchOption = tabIndex.split('I')[0]

    const handleReset = () => {
        setCurrentSearch('');
        refine('');
        onSearch(false)
    }

    const handleInputChange = (event) => {
        const value = event.currentTarget.value;
        setCurrentSearch(value);
        refine(value);
        onSearch(value.length > 0);
    };

    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
                focused={false}
                placeholder={`Search ${searchOption}...`}
                onChange={handleInputChange}
                value={currentSearch}
				sx={{
					border: 'solid #666 2px',
					borderRadius: 2,
					boxShadow: 5,
                    bgcolor: '#222',
                    '& input': {
                        color: 'white'
                    }
				  }}
            />
            <Button variant='contained' sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}} onClick={handleReset}>Reset</Button>
        </Box>
        </>
    )
}

// export const CustomSearchBox = (props) => {
//     const searchBoxApi = useSearchBox(props);
//     return <SearchBox {...searchBoxApi}/>
// }