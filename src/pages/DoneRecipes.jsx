import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';

export default class DoneRecipes extends Component {
  render() {
    const { history } = this.props;
    return (
      <div><Header history={ history } name="Done Recipes" hideSearch /></div>
    );
  }
}

DoneRecipes.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
