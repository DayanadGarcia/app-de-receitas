import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { foodsAPIOnLoad } from '../services/APIsOnLoad';
import FoodCard from './components/FoodCard';
import { categoryFoodAPI,
  recipesOfFoodsByCategory } from '../services/categorysAPI';
import { recipeFoodsOnLoad, recipesFiltered } from '../store/actions';

class Foods extends Component {
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
    const allRecipes = await foodsAPIOnLoad();
    const categorys = await categoryFoodAPI();
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
          <Redirect to={ `/foods/${recipes[0].idMeal}` } />
        </div>
      );
    }
  }

  onClickCategory = async (category) => {
    const { searchFood, saveFilteredRecipes } = this.props;
    const { filteredCategory } = this.state;
    const recipesByCategory = await recipesOfFoodsByCategory(category);

    if (filteredCategory === category) {
      searchFood(false);
      this.setState({
        filteredCategory: '',
      });
    } else {
      searchFood(true);
      this.setState({
        filteredCategory: category,
      });
      saveFilteredRecipes(recipesByCategory);
    }
  }

  render() {
    const { recipesOnLoad, categorys } = this.state;
    const { history, search, searchFood, filteredRecipes } = this.props;

    return (
      <div>
        <Header
          history={ history }
          name="Foods"
          hideSearch={ false }
          drinkPage={ false }
        />

        <button
          type="button"
          data-testid="All-category-filter"
          onClick={ () => searchFood(false) }
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
          ? <FoodCard allRecipes={ filteredRecipes } />
          : <FoodCard allRecipes={ recipesOnLoad } />}

        { filteredRecipes && this.sendToRecipePage(filteredRecipes) }

        <Footer />
      </div>
    );
  }
}

Foods.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  recipes: PropTypes.arrayOf,
  search: PropTypes.bool,
  filteredRecipes: PropTypes.arrayOf,
}.isRequired;

const mapStateToProps = (state) => ({
  recipes: state.getRecipesReducer.recipes,
  search: state.getRecipesReducer.searchFood,
  filteredRecipes: state.getRecipesReducer.filteredRecipes,
});

const mapDispatchToProps = (dispatch) => ({
  searchFood: (state) => dispatch(recipeFoodsOnLoad(state)),
  saveFilteredRecipes: (state) => dispatch(recipesFiltered(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Foods);
