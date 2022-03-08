import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { foodsAPIOnLoad } from '../services/APIsOnLoad';
import FoodCard from './components/FoodCard';
import { categoryFoodAPI, recipesOfFoodsByCategory } from '../services/categorysAPI';

class Foods extends Component {
  constructor() {
    super();

    this.state = {
      recipesOnLoad: [],
      categorys: [],
    };
  }

  async componentDidMount() {
    await this.requestAPIOnLoad();
  }

  requestAPIOnLoad = async () => {
    const allRecipes = await foodsAPIOnLoad();
    const categorys = await categoryFoodAPI();
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
          <Redirect to={ `/foods/${recipes[0].idMeal}` } />
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
        <FoodCard allRecipes={ allRecipes } />
      </div>
    );
  }

  onClickCategory = async (category) => {
    const recipesByCategory = await recipesOfFoodsByCategory(category);
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
          name="Foods"
          hideSearch={ false }
          drinkPage={ false }
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

        {!search && <FoodCard allRecipes={ recipesOnLoad } />}

        { recipes === null
          ? global.alert('Sorry, we haven\'t found any recipes for these filters.')
          : this.renderRecipes(recipes) }
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
}.isRequired;

const mapStateToProps = (state) => ({
  recipes: state.getRecipesReducer.recipes,
  search: state.getRecipesReducer.searchFood,
});

export default connect(mapStateToProps)(Foods);
