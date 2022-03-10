import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { exploreDrinkIngredients }
from '../../services/exploreIngredientsAPI';

export default class ExploreDrinksIngredients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
      ingredientsCards: [],
    };
    this.mapIngredientes = this.mapIngredientes.bind(this);
  }

  componentDidMount() {
    this.getDrinkIngredients();
  }

  getDrinkIngredients = async () => {
    const fetchIngredients = await exploreDrinkIngredients();
    this.setState({
      ingredients: fetchIngredients,
    }, () => this.mapIngredientes());
  }

  mapIngredientes() {
    const { ingredients } = this.state;
    const ingredientsArray = [];
    const MAX_NUMBER = 12;
    const teste = ingredients.map(({ strIngredient1 }) => strIngredient1);
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
          <Link to="/drinks" key={ card }>
            <div>
              <img
                src={ `https://www.thecocktaildb.com/images/ingredients/${card}.png` }
                alt={ card }
              />
              <h1>{card}</h1>
            </div>
          </Link>
        ))}
        <Footer />
      </div>
    );
  }
}

ExploreDrinksIngredients.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
