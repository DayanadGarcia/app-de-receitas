import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ingredientFoodAPI, ingredientCocktailAPI } from '../../services/IngredientAPI';
import { nameFoodAPI, nameCocktailAPI } from '../../services/nameAPI';
import { firstLetterFoodAPI,
  firstLetterCocktailAPI } from '../../services/firstLetterAPI';
import profileIcon from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import { recipeDrinksOnLoad, recipeFoodsOnLoad, responseAPI } from '../../store/actions';

class Header extends Component {
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

  searchRecipe = async () => {
    const { drinkPage, searchFood, searchDrink } = this.props;

    if (drinkPage) {
      await this.cocktailsAPI();
      searchDrink(true);
    } else {
      await this.foodsAPI();
      searchFood(true);
    }
  }

  foodsAPI = async () => {
    const { searchBar, searchRadio } = this.state;
    const { saveRecipes } = this.props;
    let response = [];

    if (searchRadio === 'ingredient') {
      response = await ingredientFoodAPI(searchBar);
      saveRecipes(response);
    } else if (searchRadio === 'name') {
      response = await nameFoodAPI(searchBar);
      saveRecipes(response);
    } else if (searchRadio === 'first-letter') {
      if (searchBar.length > 1) {
        global.alert('Your search must have only 1 (one) character');
      } else {
        response = await firstLetterFoodAPI(searchBar);
        saveRecipes(response);
      }
    }

    if (!response) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  }

  cocktailsAPI = async () => {
    const { searchBar, searchRadio } = this.state;
    const { saveRecipes } = this.props;

    if (searchRadio === 'ingredient') {
      const response = await ingredientCocktailAPI(searchBar);
      saveRecipes(response);
    } else if (searchRadio === 'name') {
      const response = await nameCocktailAPI(searchBar);
      saveRecipes(response);
    } else if (searchRadio === 'first-letter') {
      if (searchBar.length > 1) {
        global.alert('Your search must have only 1 (one) character');
      } else {
        const response = await firstLetterCocktailAPI(searchBar);
        saveRecipes(response);
      }
    }
  }

  render() {
    const { searchBar, showBar } = this.state;
    const { name, hideSearch } = this.props;
    return (
      <header>
        <button
          type="button"
          onClick={ this.sendToProfile }
          data-testid="profile-top-btn"
          src={ profileIcon }
        >
          <img src={ profileIcon } alt="profileIcon" />
        </button>
        <h1 data-testid="page-title">{name}</h1>
        {!hideSearch && (
          <button
            onClick={ this.handleClick }
            type="button"
            data-testid="search-top-btn"
            src={ searchIcon }
          >
            <img src={ searchIcon } alt="searchIcon" />
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
  saveRecipes: PropTypes.func,
  searchDrink: PropTypes.func,
  searchFood: PropTypes.func,
}.isRequired;

const mapDispatchToProps = (dispatch) => ({
  saveRecipes: (state) => dispatch(responseAPI(state)),
  searchFood: (state) => dispatch(recipeFoodsOnLoad(state)),
  searchDrink: (state) => dispatch(recipeDrinksOnLoad(state)),
});

export default connect(null, mapDispatchToProps)(Header);
