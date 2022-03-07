import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';

export default class ExploreFoodsIngredients extends Component {
  render() {
    const { history } = this.props;
    return (
      <div><Header history={ history } name="Explore Foods Ingredients" /></div>
    );
  }
}

ExploreFoodsIngredients.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
