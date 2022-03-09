import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { detailsFoodFetch } from '../../services/detailsAPI';

export default class FoodRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
    };
  }

  componentDidMount() {
    this.getIdAndApi();
  }

  getIdAndApi = async () => {
    const { match: { params: { id } } } = this.props;
    const fetchFood = await detailsFoodFetch(id);
    const foods = fetchFood[0];
    console.log(foods);
    this.setState({
      recipes: foods,
    });
  }

  render() {
    const { recipes } = this.state;
    return (
      <div>
        <img
          data-testid="recipe-photo"
          src={ recipes.strMealThumb }
          alt={ recipes.strMeal }
        />
        <h1 data-testid="recipe-title">{ recipes.strMeal }</h1>
        <button data-testid="share-btn" type="button">Compartilhar</button>
        <button data-testid="favorite-btn" type="button">Favoritar</button>
        <span data-testid="recipe-category">{ recipes.strCategory }</span>
        <p>
          { recipes.strIngredient1 }
        </p>
        <iframe
          title={ recipes.strMeal }
          data-testid="video"
          width="420"
          height="315"
          src={ recipes.strYoutube }
        />
        <p data-testid="instructions">{ recipes.strInstructions }</p>
        {/* <div data-testid={ `${index}-recomendation-card` } /> */}
        <button
          data-testid="start-recipe-btn"
          type="button"
        >
          Iniciar Receita
        </button>
      </div>
    );
  }
}

FoodRecipe.propTypes = {
  match: PropTypes.string.isRequired,
  params: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
