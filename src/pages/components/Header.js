import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ingredientFoodAPI, ingredientCocktailAPI } from '../../services/IngredientAPI';
import { nameFoodAPI, nameCocktailAPI } from '../../services/nameAPI';
import { firstLetterFoodAPI,
  firstLetterCocktailAPI } from '../../services/firstLetterAPI';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBar: '',
      showBar: false,
      searchRadio: '',
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

  searchRecipe = () => {
    const { drinkPage } = this.props;
    if (drinkPage) {
      this.cocktailsAPI();
    } else {
      this.foodsAPI();
    }
  }

  foodsAPI = async () => {
    const { searchBar, searchRadio } = this.state;
    if (searchRadio === 'ingredient') {
      const response = await ingredientFoodAPI(searchBar);
      console.log(response);
    } else if (searchRadio === 'name') {
      const response = await nameFoodAPI(searchBar);
      console.log(response);
    } else if (searchRadio === 'first-letter') {
      if (searchBar.length > 1) {
        global.alert('Your search must have only 1 (one) character');
      } else {
        const response = await firstLetterFoodAPI(searchBar);
        console.log(response);
      }
    }
  }

  cocktailsAPI = async () => {
    const { searchBar, searchRadio } = this.state;
    if (searchRadio === 'ingredient') {
      const response = await ingredientCocktailAPI(searchBar);
      console.log(response);
    } else if (searchRadio === 'name') {
      const response = await nameCocktailAPI(searchBar);
      console.log(response);
    } else if (searchRadio === 'first-letter') {
      if (searchBar.length > 1) {
        global.alert('Your search must have only 1 (one) character');
      } else {
        const response = await firstLetterCocktailAPI(searchBar);
        console.log(response);
      }
    }
  }

  render() {
    const { searchBar, showBar } = this.state;
    const { name, hideSearch } = this.props;
    return (
      <header>
        <button
          data-testid="profile-top-btn"
          type="button"
          onClick={ this.sendToProfile }
          src="../images/profileIcon.svg"
        >
          <img src="../images/searchIcon.svg" alt="profileIcon" />
        </button>
        <h1 data-testid="page-title">{name}</h1>
        {!hideSearch && (
          <button
            onClick={ this.handleClick }
            data-testid="search-top-btn"
            type="button"
            src="../images/searchIcon.svg"
          >
            <img src="../images/searchIcon.svg" alt="searchIcon" />
          </button>
        )}
        {showBar ? (
          <div>
            <input
              data-testid="search-input"
              type="text"
              name="searchBar"
              value={ searchBar }
              onChange={ this.handleChange }
            />
            <label htmlFor="ingredient">
              <input
                type="radio"
                id="ingredient"
                name="searchRadio"
                value="ingredient"
                data-testid="ingredient-search-radio"
                onChange={ this.handleChange }
              />
              Ingredient
            </label>
            <label htmlFor="name">
              <input
                type="radio"
                id="name"
                name="searchRadio"
                value="name"
                data-testid="name-search-radio"
                onChange={ this.handleChange }
              />
              Name
            </label>
            <label htmlFor="first-letter">
              <input
                type="radio"
                id="first-letter"
                name="searchRadio"
                value="first-letter"
                data-testid="first-letter-search-radio"
                onChange={ this.handleChange }
              />
              First letter
            </label>
            <button
              type="button"
              data-testid="exec-search-btn"
              onClick={ this.searchRecipe }
            >
              Search
            </button>
          </div>
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
