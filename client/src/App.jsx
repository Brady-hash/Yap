import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
  } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

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
	const { authUser } = useAuthContext();
	return (
		<ApolloProvider client={client}>
		<div className='p-4 h-screen flex items-center justify-center'>
			<Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
			</Routes>
			<Toaster />
		</div>
		</ApolloProvider>
	);
}

export default App;
