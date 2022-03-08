import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { detailsDrinkFetch } from '../../services/detailsAPI';

export default class DrinkRecipe extends Component {
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
    const fetchDrink = await detailsDrinkFetch(id);
    const drinks = fetchDrink[0];
    console.log(drinks);
    this.setState({
      recipes: drinks,
    });
  }

  render() {
    const { recipes } = this.state;
    return (
      <div>
        <img
          data-testid="recipe-photo"
          src={ recipes.strDrinkThumb }
          alt={ recipes.strDrink }
        />
        <h1 data-testid="recipe-title">{ recipes.strDrink }</h1>
        <span>{ recipes.strAlcoholic }</span>
        <span data-testid="recipe-category">{ recipes.strCategory }</span>
        <p>
          { recipes.strIngredient1 }
        </p>
        <p data-testid="instructions">{ recipes.strInstructions }</p>
        {/* <div data-testid={ `${index}-recomendation-card` } /> */}
        <button data-testid="share-btn" type="button">Compartilhar</button>
        <button data-testid="favorite-btn" type="button">Favoritar</button>
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

DrinkRecipe.propTypes = {
  match: PropTypes.string.isRequired,
  params: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
