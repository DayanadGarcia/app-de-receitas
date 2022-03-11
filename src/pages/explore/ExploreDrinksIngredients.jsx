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
    };
  }

  componentDidMount() {
    this.getDrinkIngredients();
  }

  getDrinkIngredients = async () => {
    const fetchIngredients = await exploreDrinkIngredients();
    const filtred = fetchIngredients.map(({ strIngredient1 }) => strIngredient1);
    this.setState({
      ingredients: filtred,
    });
  }

  render() {
    const { history } = this.props;
    const { ingredients } = this.state;
    return (
      <div>
        <Header history={ history } name="Explore Ingredients" hideSearch />
        {ingredients.map((card, index) => (
          <Link
            data-testid={ `${index}-ingredient-card` }
            to="/drinks"
            key={ card }
          >
            <div>
              <img
                data-testid={ `${index}-card-img` }
                src={ `https://www.thecocktaildb.com/images/ingredients/${card}-Small.png` }
                alt={ card }
              />
              <h1 data-testid={ `${index}-card-name` }>{card}</h1>
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
