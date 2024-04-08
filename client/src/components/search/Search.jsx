import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { Box } from '@mui/material';
import { InstantSearch, Hits, Configure } from 'react-instantsearch';
import { CustomSearchBox } from './SearchBox';
import { CustomPagination } from './Pagination';
import { UserHit } from './UserHit';
import { ThreadHit } from './ThreadHit';
// import { useAuthContext } from '../../context/AuthContext';
// import { useQuery } from '@apollo/client';
// import { QUERY_ME } from '../../utils/queries';

// function Hit({ hit }) {
    // console.log(hit)
    // return (
    //   <Box sx={{ display: 'flex'}}>
    //     {/* <img src={hit.backdrop_path} alt={hit.title} /> */}
    //     <h1>{hit.title}</h1>
    //   </Box>
    // );
//   }

export const Search = ({ tabIndex }) => {
    // const { loading, data, error } = useQuery(QUERY_ME);
    // const friends = data?.me.friends;
    // const messageThreads = data?.me.messageThreads;
    // // console.log(friends)
    // // console.log(messageThreads)
    const searchClient = algoliasearch('3ECRGKFTT4', '59491801aa4f784d065d8475e2cc0a99');
    const [isInputEmpty, setInputEmpty] = useState(true);
    const hitComponent = tabIndex === 'usersIndex' ? UserHit : ThreadHit;

    return (
        <>
        <Box sx={{ width: '100%' }}>
        <InstantSearch searchClient={searchClient} indexName={tabIndex}>
            <Configure hitsPerPage={10} />
            <CustomSearchBox onSearch={(isEmpty) => setInputEmpty(!isEmpty)}/>
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