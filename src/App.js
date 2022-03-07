import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route path="/foods" component={ Login } />
        <Route path="/drinks" component={ Login } />
        <Route path="/foods/{id-da-receita}" component={ Login } />
        <Route path="/drinks/{id-da-receita}" component={ Login } />
        <Route path="/foods/{id-da-receita}/in-progress" component={ Login } />
        <Route path="/drinks/{id-da-receita}/in-progress" component={ Login } />
        <Route path="/explore" component={ Login } />
        <Route path="/explore/foods" component={ Login } />
        <Route path="/explore/drinks" component={ Login } />
        <Route path="/explore/foods/ingredients" component={ Login } />
        <Route path="/explore/drinks/ingredients" component={ Login } />
        <Route path="/explore/foods/nationalities" component={ Login } />
        <Route path="/explore/foods/nationalities" component={ Login } />
        <Route path="/done-recipes" component={ Login } />
        <Route path="/favorite-recipes" component={ Login } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
