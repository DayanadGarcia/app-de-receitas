import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Foods from './pages/Foods';
import Profile from './pages/Profile';
import Drinks from './pages/Drinks';
import Explore from './pages/explore/Explore';
import ExploreDrinks from './pages/explore/ExploreDrinks';
import ExploreDrinksIngredients from './pages/explore/ExploreDrinksIngredients';
import ExploreFoods from './pages/explore/ExploreFoods';
import ExploreFoodsIngredients from './pages/explore/ExploreFoodsIngredients';
import ExploreFoodsNationalities from './pages/explore/ExploreFoodsNationalities';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route path="/foods" component={ Foods } />
        <Route path="/profile" component={ Profile } />
        <Route path="/drinks" component={ Drinks } />
        <Route path="/foods/:id-da-receita" component={ Foods } />
        <Route path="/drinks/:id-da-receita" component={ Drinks } />
        <Route path="/foods/:id-da-receita/in-progress" component={ Foods } />
        <Route path="/drinks/:id-da-receita/in-progress" component={ Drinks } />
        <Route path="/explore" component={ Explore } />
        <Route path="/explore/foods" component={ ExploreFoods } />
        <Route path="/explore/drinks" component={ ExploreDrinks } />
        <Route path="/explore/foods/ingredients" component={ ExploreFoodsIngredients } />
        <Route
          path="/explore/drinks/ingredients"
          component={ ExploreDrinksIngredients }
        />
        <Route
          path="/explore/foods/nationalities"
          component={ ExploreFoodsNationalities }
        />
        <Route path="/done-recipes" component={ DoneRecipes } />
        <Route path="/favorite-recipes" component={ FavoriteRecipes } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
