import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';

export default class FavoriteRecipes extends Component {
  render() {
    const { history } = this.props;
    return (
      <div><Header history={ history } name="Favorite Recipes" hideSearch /></div>
    );
  }
}

FavoriteRecipes.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
