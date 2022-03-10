import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { exploreFoodIngredients }
from '../../services/exploreIngredientsAPI';

export default class ExploreFoodsIngredients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
      ingredientsCards: [],
    };
    this.mapIngredientes = this.mapIngredientes.bind(this);
  }

  componentDidMount() {
    this.getFoodIngredients();
  }

  getFoodIngredients = async () => {
    const fetchIngredients = await exploreFoodIngredients();
    this.setState({
      ingredients: fetchIngredients,
    }, () => this.mapIngredientes());
  }

  mapIngredientes() {
    const { ingredients } = this.state;
    const ingredientsArray = [];
    const MAX_NUMBER = 12;
    const teste = ingredients.map(({ strIngredient }) => strIngredient);
    for (let i = 1; i <= MAX_NUMBER; i += 1) {
      ingredientsArray.push(teste[i]);
    }
    this.setState({
      ingredientsCards: ingredientsArray,
    });
  }

  render() {
    const { history } = this.props;
    const { ingredientsCards } = this.state;
    return (
      <div>
        <Header history={ history } name="Explore Ingredients" hideSearch />
        {ingredientsCards.map((card) => (
          <div key={ card }>
            <img
              src={ `https://www.themealdb.com/images/ingredients/${card}-Small.png` }
              alt={ card }
            />
            <h1>{card}</h1>
          </div>
        ))}
        <Footer />
      </div>
    );
  }
}

ExploreFoodsIngredients.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
