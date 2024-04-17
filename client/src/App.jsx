import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
  } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { UserProvider } from './context/UserContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { NavBar } from './components/NavBar.jsx';
import DynamicBackground from './components/Background.jsx';
import { CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

const httpLink = createHttpLink({
	uri: '/graphql',
});
  
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('id_token');
	return {
		headers : {
		...headers,
		authorization: token ? `Bearer ${token}` : '',
	},
	};
});
  
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

function App() {

	return (
		<>
		<ThemeProvider>
			<CssBaseline />
			<DynamicBackground />
			<ApolloProvider client={client}>
				<UserProvider>
					<NavBar />
					<Outlet />
				</UserProvider>
			</ApolloProvider>
			</ThemeProvider>
		</>
	);
}

export default App;
