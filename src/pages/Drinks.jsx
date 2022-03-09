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
import { recipeDrinksOnLoad, recipesFiltered } from '../store/actions';

class Drinks extends Component {
  constructor() {
    super();

    this.state = {
      recipesOnLoad: [],
      categorys: [],
      filteredCategory: '',
    };
  }

  async componentDidMount() {
    await this.requestAPIOnLoad();
  }

  requestAPIOnLoad = async () => {
    const { saveFilteredRecipes } = this.props;
    const allRecipes = await cocktailsAPIOnLoad();
    const categorys = await categoryCocktailAPI();
    this.setState({
      recipesOnLoad: allRecipes,
      categorys,
    });
    saveFilteredRecipes(allRecipes);
  }

  sendToRecipePage = (recipes) => {
    const { filteredCategory } = this.state;

    if (recipes.length === 1 && filteredCategory === '') {
      return (
        <div>
          <Redirect to={ `/drinks/${recipes[0].idDrink}` } />
        </div>
      );
    }
  }

  onClickCategory = async (category) => {
    const { searchDrink, saveFilteredRecipes } = this.props;
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
        filteredCategory: category,
      });
      saveFilteredRecipes(recipesByCategory);
    }
  }

  render() {
    const { recipesOnLoad, categorys } = this.state;
    const { history, search, searchDrink, filteredRecipes } = this.props;

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

        {search && filteredRecipes
          ? <DrinkCard allRecipes={ filteredRecipes } />
          : <DrinkCard allRecipes={ recipesOnLoad } />}

        { filteredRecipes && this.sendToRecipePage(filteredRecipes) }

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
  filteredRecipes: state.getRecipesReducer.filteredRecipes,
});

const mapDispatchToProps = (dispatch) => ({
  searchDrink: (state) => dispatch(recipeDrinksOnLoad(state)),
  saveFilteredRecipes: (state) => dispatch(recipesFiltered(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Drinks);
