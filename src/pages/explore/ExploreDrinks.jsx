import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';

export default class ExploreDrinks extends Component {
  render() {
    const { history } = this.props;
    return (
      <div><Header history={ history } name="Explore Drinks" hideSearch /></div>
    );
  }
}

ExploreDrinks.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
