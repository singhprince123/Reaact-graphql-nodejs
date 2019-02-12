import React, { Component } from 'react';
import { BrowserRouter , Route, Redirect , Switch} from 'react-router-dom'
import './App.css';
import AuthPages from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPages from './pages/Bookings'
import MainNavigation from './components/navigation/MainNavigation'


class App extends Component {
  render() {
    return (
      <BrowserRouter >
      <React.Fragment>
      <MainNavigation />
     <main className="main-content">
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route  path="/auth" component={AuthPages}/>
        <Route  path="/events" component={EventsPage}/>
        <Route  path="/bookings" component={BookingsPages}/>
      </Switch>
     </main>
     </React.Fragment>
      </BrowserRouter>
     
    );
  }
}

export default App;
