import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import reducer from './reducers/reducer'
import PaginationContainer from "./containers/PaginationContainer";

const app = document.getElementById('app')

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:5000/graphql' }),
});

const store = createStore(
	 combineReducers({
		 newsReducer:reducer,
		 apollo: client.reducer()
		}),
	 {newsReducer:{loading:true}},
	 applyMiddleware(client.middleware())
)

ReactDOM.render(
	<ApolloProvider store={store} client={client}>
		<MuiThemeProvider>
			<PaginationContainer/>
		</MuiThemeProvider>
	</ApolloProvider>
	, app)

/*const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.render(
	<MuiThemeProvider>
		<Provider store={store}>
			<NewsContainer/>
		</Provider>
	</MuiThemeProvider>
	, app)*/
