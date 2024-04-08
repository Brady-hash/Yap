import { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useSearchBox } from 'react-instantsearch';

export const CustomSearchBox = ({ onSearch }) => {
    const { query, refine } = useSearchBox();
    const [currentSearch, setCurrentSearch] = useState('');

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
                placeholder="search..."
                onChange={handleInputChange}
                value={currentSearch}
				sx={{
					border: 'solid #555 2px',
					borderRadius: 2,
					boxShadow: 5,
                    bgcolor: 'whitesmoke'
                    // width: '85%',
				  }}
            />
            <Button variant='contained' onClick={handleReset}>Reset</Button>
        </Box>
        </>
    )
}

// export const CustomSearchBox = (props) => {
//     const searchBoxApi = useSearchBox(props);
//     return <SearchBox {...searchBoxApi}/>
// }