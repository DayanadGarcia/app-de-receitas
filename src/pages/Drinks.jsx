import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from './components/Header';
import Footer from './components/Footer';

class Drinks extends Component {
  renderRecipes = () => {
    const { recipes } = this.props;
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
      allRecipes.map((recipe, index) => (
        <div data-testid={ `${index}-recipe-card` } key={ recipe.idDrink }>
          <img
            src={ recipe.strDrinkThumb }
            alt={ recipe.strDrink }
            data-testid={ `${index}-card-img` }
          />
          <p data-testid={ `${index}-card-name` }>{ recipe.strDrink }</p>
        </div>
      ))
    );
  }

  render() {
    const { history, recipes } = this.props;
    console.log(recipes);
    return (
      <div>
        <Header history={ history } name="Drinks" hideSearch={ false } drinkPage />
        { recipes === null
          ? global.alert('Sorry, we haven\'t found any recipes for these filters.')
          : this.renderRecipes() }
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
}.isRequired;

const mapStateToProps = (state) => ({
  recipes: state.getRecipesReducer.recipes,
});

export default connect(mapStateToProps)(Drinks);
