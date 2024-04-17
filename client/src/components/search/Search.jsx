import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { Box } from '@mui/material';
import { InstantSearch, Hits, Configure } from 'react-instantsearch';
import { CustomSearchBox } from './SearchBox';
import { CustomPagination } from './Pagination';
import { UserHit } from './UserHit';
import { ThreadHit } from './ThreadHit';

export const Search = ({ tabIndex }) => {
    const searchClient = algoliasearch('3ECRGKFTT4', '59491801aa4f784d065d8475e2cc0a99');
    const [isInputEmpty, setInputEmpty] = useState(true);
    const hitComponent = tabIndex === 'dev_YAP_USERS' ? UserHit : ThreadHit;

    return (
        <>
        <Box sx={{ width: '100%' }}>
        <InstantSearch searchClient={searchClient} indexName={tabIndex}>
            <Configure hitsPerPage={10} />
            <CustomSearchBox onSearch={(isEmpty) => setInputEmpty(!isEmpty)} tabIndex={tabIndex}/>
            {!isInputEmpty && (
                <>
                    <Box sx={{ my: 3 }}>
                        <Hits hitComponent={hitComponent}/>
                        <CustomPagination />
                    </Box>
                </>
            )}
        </InstantSearch>
        </Box>
        </>
    )
};