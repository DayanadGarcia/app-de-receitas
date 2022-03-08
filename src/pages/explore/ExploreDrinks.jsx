import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { randomDrink } from '../../services/randomRecipeAPI';

export default class ExploreDrinks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
    };
  }

  componentDidMount() {
    this.randomApiDrink();
  }

  randomApiDrink = async () => {
    const fetchDrink = await randomDrink();
    const randomIdDrink = fetchDrink[0].idDrink;
    this.setState({
      id: randomIdDrink,
    });
  }

  render() {
    const { history } = this.props;
    const { id } = this.state;
    return (
      <div>
        <Header history={ history } name="Explore Drinks" hideSearch />
        <button
          onClick={ () => history.push('/explore/drinks/ingredients') }
          data-testid="explore-by-ingredient"
          type="button"
        >
          By Ingredient
        </button>
        <button
          onClick={ () => history.push(`/drinks/${id}`) }
          data-testid="explore-surprise"
          type="button"
        >
          Suprise me!
        </button>
        <Footer />
      </div>
    );
  }
}

ExploreDrinks.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
