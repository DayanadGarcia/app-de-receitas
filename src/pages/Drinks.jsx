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
import { recipeDrinksOnLoad } from '../store/actions';

class Drinks extends Component {
  constructor() {
    super();

    this.state = {
      recipesOnLoad: [],
      filteredRecipes: [],
      categorys: [],
      filteredCategory: '',
    };
  }

  async componentDidMount() {
    await this.requestAPIOnLoad();
  }

  requestAPIOnLoad = async () => {
    const allRecipes = await cocktailsAPIOnLoad();
    const categorys = await categoryCocktailAPI();
    this.setState({
      recipesOnLoad: allRecipes,
      filteredRecipes: allRecipes,
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
    const { searchDrink } = this.props;
    const { filteredCategory } = this.state;
    const recipesByCategory = await recipesOfCocktailsByCategory(category);

    if (filteredCategory === category) {
      searchDrink(false);
      this.setState({
        filteredCategory: '',
      });
    } else {
      searchDrink(true);
      this.setState({
        filteredRecipes: recipesByCategory,
        filteredCategory: category,
      });
    }
  }

  render() {
    const { recipesOnLoad, categorys, filteredRecipes } = this.state;
    const { history, recipes, search, searchDrink } = this.props;

    return (
      <div>
        <Header
          history={ history }
          name="Drinks"
          hideSearch={ false }
          drinkPage
        />

        <button
          type="button"
          data-testid="All-category-filter"
          onClick={ () => searchDrink(false) }
        >
          All
        </button>

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

        {!search
          ? <DrinkCard allRecipes={ recipesOnLoad } />
          : <DrinkCard allRecipes={ filteredRecipes } />}

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

const mapDispatchToProps = (dispatch) => ({
  searchDrink: (state) => dispatch(recipeDrinksOnLoad(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Drinks);
