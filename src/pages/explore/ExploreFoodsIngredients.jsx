import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { exploreFoodIngredients }
from '../../services/exploreIngredientsAPI';

export default class ExploreFoodsIngredients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
    };
  }

  componentDidMount() {
    this.getFoodIngredients();
  }

  getFoodIngredients = async () => {
    const fetchIngredients = await exploreFoodIngredients();
    const filtred = fetchIngredients.map(({ strIngredient }) => strIngredient);
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
          <Link data-testid={ `${index}-ingredient-card` } to="/foods/" key={ card }>
            <div>
              <img
                data-testid={ `${index}-card-img` }
                src={ `https://www.themealdb.com/images/ingredients/${card}-Small.png` }
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

ExploreFoodsIngredients.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
