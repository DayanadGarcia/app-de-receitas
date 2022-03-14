import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';

export default class FavoriteRecipes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: [],
      copied: false,
    };
    this.getFavs = this.getFavs.bind(this);
    this.removeFav = this.removeFav.bind(this);
  }

  componentDidMount() {
    this.getFavs();
  }

  getFavs() {
    const local = localStorage.getItem('favoriteRecipes');
    const filters = JSON.parse(local);
    this.setState({
      favorites: filters,
    });
  }

  shareButton = (id, type) => {
    if (type === 'food') {
      type = 'foods';
    } else {
      type = 'drinks';
    }
    navigator.clipboard.writeText(`http://localhost:3000/${type}/${id}`);
    this.setState({ copied: true });
  }

  foodFilter = () => {
    const local = localStorage.getItem('favoriteRecipes');
    const filters = JSON.parse(local);
    const foods = filters.filter((food) => food.type === 'food');
    this.setState({
      favorites: foods,
    });
  }

  drinkFilter = () => {
    const local = localStorage.getItem('favoriteRecipes');
    const filters = JSON.parse(local);
    const drinks = filters.filter((drink) => drink.type === 'drink');
    this.setState({
      favorites: drinks,
    });
  }

  removeFav(id) {
    const local = localStorage.getItem('favoriteRecipes');
    const filters = JSON.parse(local);
    const newFavorites = filters.filter(
      (recipe) => recipe.id !== id,
    );
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    this.getFavs();
  }

  render() {
    const { history } = this.props;
    const { favorites, copied } = this.state;
    return (
      <div>
        <Header history={ history } name="Favorite Recipes" hideSearch />
        <button
          data-testid="filter-by-all-btn"
          onClick={ this.getFavs }
          type="button"
        >
          All
        </button>
        <button
          data-testid="filter-by-food-btn"
          onClick={ this.foodFilter }
          type="button"
        >
          Food
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ this.drinkFilter }
          type="button"
        >
          Drink
        </button>
        {favorites.map((favorite, index) => (
          <div key={ favorite.id }>
            <Link to={ `/${favorite.type}s/${favorite.id}` }>
              <h1 data-testid={ `${index}-horizontal-name` }>{favorite.name}</h1>
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ favorite.image }
                alt={ favorite.name }
              />
              <h2
                data-testid={ `${index}-horizontal-top-text` }
              >
                {`Categoria: ${favorite.category}`}
              </h2>
              {favorite.type === 'food' ? (
                <h3>{`Nacionalidade: ${favorite.nationality}`}</h3>) : null}
              {favorite.alcoholicOrNot.length > 1 ? (
                <h4>{favorite.alcoholicOrNot}</h4>) : null}
            </Link>
            <button
              data-testid={ `${index}-horizontal-favorite-btn` }
              onClick={ () => this.removeFav(favorite.id) }
              type="button"
              value={ favorite.name }
            >
              <img src={ blackHeartIcon } alt="favoritado" />
            </button>
            <button
              data-testid={ `${index}-horizontal-share-btn` }
              onClick={
                () => this.shareButton(favorite.id, favorite.type)
              }
              type="button"
              value={ favorite.id }
            >
              <img src={ shareIcon } alt="shareIcon" />
            </button>
          </div>
        ))}
        { copied && <p>Link copied!</p>}
      </div>
    );
  }
}

FavoriteRecipes.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
