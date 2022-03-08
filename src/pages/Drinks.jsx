import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from './components/Header';
import Footer from './components/Footer';
import DrinkCard from './components/DrinkCard';
import { cocktailsAPIOnLoad } from '../services/APIsOnLoad';
import { categoryCocktailAPI,
  recipesOfCocktailsByCategory } from '../services/categorysAPI';

class Drinks extends Component {
  constructor() {
    super();

    this.state = {
      recipesOnLoad: [],
      categorys: [],
    };
  }

  componentDidMount() {
    this.requestAPIOnLoad();
  }

  requestAPIOnLoad = async () => {
    const allRecipes = await cocktailsAPIOnLoad();
    const categorys = await categoryCocktailAPI();
    this.setState({
      recipesOnLoad: allRecipes,
      categorys,
    });
  }

  renderRecipes = (recipes) => {
    const MAX_LENGTH = 12;
    let allRecipes = [];

    if (recipes.length === 1) {
      return (
        <div>
          <Redirect to={ `/drinks/${recipes[0].idDrink}` } />
        </div>
      );
    }

    if (recipes.length > MAX_LENGTH) {
      allRecipes = recipes.slice(0, MAX_LENGTH);
    } else {
      allRecipes = recipes;
    }

    return (
      <div>
        <DrinkCard allRecipes={ allRecipes } />
      </div>
    );
  }

  onClickCategory = async (category) => {
    const recipesByCategory = await recipesOfCocktailsByCategory(category);
    console.log(recipesByCategory);
    this.setState({ recipesOnLoad: recipesByCategory });
  }

  render() {
    const { recipesOnLoad, categorys } = this.state;
    const { history, recipes, search } = this.props;
    return (
      <div>
        <Header
          history={ history }
          name="Drinks"
          hideSearch={ false }
          drinkPage
        />

        {categorys.map(({ strCategory }) => (
          <button
            type="button"
            key={ strCategory }
            data-testid={ `${strCategory}-category-filter` }
            onClick={ () => this.onClickCategory(strCategory) }
          >
            {strCategory}
          </button>
        ))}

        {!search && <DrinkCard allRecipes={ recipesOnLoad } />}

        { recipes === null
          ? global.alert('Sorry, we haven\'t found any recipes for these filters.')
          : this.renderRecipes(recipes) }
        <Footer />
      </div>
    );
  }
}

Drinks.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  recipes: PropTypes.arrayOf,
  search: PropTypes.bool,
}.isRequired;

const mapStateToProps = (state) => ({
  recipes: state.getRecipesReducer.recipes,
  search: state.getRecipesReducer.searchDrink,
});

export default connect(mapStateToProps)(Drinks);
