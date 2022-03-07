import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBar: '',
      showBar: false,
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  handleClick = () => {
    this.setState(({ showBar }) => ({
      showBar: !showBar,
    }));
  }

  sendToProfile = () => {
    const { history } = this.props;
    history.push('/profile');
  }

  render() {
    const { searchBar, showBar } = this.state;
    const { name } = this.props;
    return (
      <header>
        <button
          data-testid="profile-top-btn"
          type="button"
          onClick={ this.sendToProfile }
        >
          <img src="../images/searchIcon.svg" alt="profileIcon" />
        </button>
        <h1 data-testid="page-title">{name}</h1>
        <button onClick={ this.handleClick } data-testid="search-top-btn" type="button">
          <img src="../images/searchIcon.svg" alt="searchIcon" />
        </button>
        {showBar ? (
          <input
            type="text"
            name="searchBar"
            value={ searchBar }
            onChange={ this.handleChange }
          />
        ) : null}
      </header>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;