import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { detailsFoodFetch } from '../../services/detailsAPI';

export default class FoodRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      ingredients: [],
    };
  }

  componentDidMount() {
    this.getIdAndApi();
  }

  getIdAndApi = async () => {
    const { match: { params: { id } } } = this.props;
    const fetchFood = await detailsFoodFetch(id);
    const ingredients = [];
    const MAX_INGREDIENTS = 20;
    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      if (fetchFood[0][`strIngredient${i}`] !== '') {
        ingredients.push(fetchFood[0][`strIngredient${i}`]);
      }
    }
    this.setState({
      recipes: fetchFood[0],
      ingredients,
    });
  }

  render() {
    const { recipes, ingredients } = this.state;
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
        {ingredients.map((ingredient, index) => (
          <p
            key={ ingredient }
            data-testid={ `${index}-ingredient-name-and-measure` }
          >
            {ingredient}
          </p>
        ))}
        {/* <iframe
          title={ recipes.strMeal }
          data-testid="video"
          width="420"
          height="315"
          src={ recipes.strYoutube }
        /> */}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;
