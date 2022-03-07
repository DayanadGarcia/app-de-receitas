import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';

export default class ExploreFoodsNationalities extends Component {
  render() {
    const { history } = this.props;
    return (
      <div><Header history={ history } name="Explore Foods Nationalities" /></div>
    );
  }
}

ExploreFoodsNationalities.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
