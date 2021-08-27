import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Landing from './components/Landing';
import {setContext} from 'apollo-link-context';
import Signup from './pages/Signup';
import Login from './pages/Login';
import IsAuthenticated from './components/IsAuthenticated';
import './App.css';
import Profile from './pages/Profile';
import Home from './pages/Home';
import SingleTweet from './pages/SingleTweet';
import SingleUser from './pages/SingleUser';

// const client = new ApolloClient({
//   uri:"http://localhost:4000",
//   cache: new InMemoryCache()
// })
const httpLink = new HttpLink({uri:'http://localhost:4000'})
const authlink = setContext( async( req, { headers } ) => { // {headers : previous context}
// setContext((GraphQL request being executed, previous context) => {return object or a promise => returns an object to set the new context of a request})
// context is an object shared by all the resolvers of a specific execution. 
// It's useful for keeping data such as authentication info, the current user, database connection, data sources and other things you need for running your business logic.
  const token = localStorage.getItem('token')

  return {
    ...headers,
    headers:{
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const link = authlink.concat(httpLink as any)

// By default, Apollo Client uses Apollo Link's HttpLink to send GraphQL queries over HTTP.
// One of uri or link is required. If you provide both, link takes precedence.
const client = new ApolloClient(
 {
  link: (link as any),
  cache: new InMemoryCache()}
)
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/landing">
            <Landing />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
            <Route path="/login">
            <Login />
          </Route>
          <IsAuthenticated>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/tweet/:id">
              <SingleTweet />
            </Route>
            <Route path="/user/:id">
              <SingleUser />
            </Route>
          </IsAuthenticated>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
