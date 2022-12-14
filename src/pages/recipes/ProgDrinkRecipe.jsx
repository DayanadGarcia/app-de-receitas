import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { detailsDrinkFetch } from '../../services/detailsAPI';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import '../../styles/progRecipe.css';
import { changeDoneLocalStorage, changeFavoritesLocalStorage,
  changeIngredientsInProgressLocalStorage } from '../../services/changeLocalStorageDrink';

export default class ProgFoodRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      ingredients: [],
      copied: false,
      favorited: false,
      disable: true,
    };
  }

  componentDidMount() {
    this.getIdAndApi();
    this.isChecked();
  }

  checkFavorited = () => {
    const { recipes } = this.state;
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes'));

    if (favorites) {
      this.setState({
        favorited: favorites.find((favorite) => favorite.id === recipes.idDrink),
      });
    }
  }

  getIdAndApi = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const fetchDrink = await detailsDrinkFetch(id);
    let ingredients = [];
    const MAX_INGREDIENTS = 20;

    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      if (
        fetchDrink[0][`strIngredient${i}`] === null
        || fetchDrink[0][`strIngredient${i}`] === ''
        || fetchDrink[0][`strIngredient${i}`] === undefined
      ) {
        ingredients = [...ingredients];
      } else {
        ingredients.push([
          fetchDrink[0][`strIngredient${i}`],
          fetchDrink[0][`strMeasure${i}`],
        ]);
      }
    }

    this.setState({
      recipes: fetchDrink[0],
      ingredients,
    });

    this.getRecipesInProgress();
    this.checkFavorited();
  };

  getRecipesInProgress = () => {
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const { recipes } = this.state;
    const id = recipes.idDrink;
    if (inProgress && inProgress.cocktails) {
      this.isChecked(inProgress.cocktails[id]);
    }
  };

  isChecked = (checkboxes) => {
    const { ingredients } = this.state;
    const checkboxChecked = checkboxes;

    if (checkboxChecked) {
      const ingredientsLocalstorage = ingredients.map((ingredient) => {
        if (checkboxChecked.includes(ingredient[0])) {
          return [...ingredient, true];
        }
        return [...ingredient, false];
      });

      this.setState({
        ingredients: ingredientsLocalstorage,
      }, this.disabledButton(true));
    }
  };

  shareButton = () => {
    const { recipes } = this.state;
    navigator.clipboard.writeText(
      `http://localhost:3000/drinks/${recipes.idDrink}`,
    );
    this.setState({ copied: true });
  };

  favoriteRecipe = () => {
    this.setState(
      ({ favorited }) => ({ favorited: !favorited }),
      this.setLocalStorage(),
    );
  };

  setLocalStorage = () => {
    const { recipes, favorited } = this.state;
    changeFavoritesLocalStorage(recipes, favorited);
  };

  saveIngredients = ({ target }) => {
    const recipeId = target.id;
    const ingredient = target.name;
    const addFirstDrink = { cocktails: { [recipeId]: [ingredient] } };
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    this.disabledButton(false);
    // caso ja exista algo salvo no localstorage em progresso
    if (inProgress !== null) {
      changeIngredientsInProgressLocalStorage(recipeId,
        ingredient, inProgress);
      // caso n??o exista nada salvo no localstorage ainda
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify(addFirstDrink));
    }
  };

  disabledButton = (onLoad) => {
    const { ingredients, recipes } = this.state;
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    let result = true;
    if (inProgress && inProgress.cocktails) {
      if (onLoad) {
        result = inProgress.cocktails[recipes.idDrink].length !== (ingredients.length);
      } else if (inProgress.cocktails[recipes.idDrink]) {
        result = inProgress.cocktails[recipes.idDrink].length
        !== (ingredients.length - 1);
      }
    }
    this.setState({
      disable: result,
    });
  }

  finishRecipe = () => {
    const { recipes } = this.state;
    const { history } = this.props;
    changeDoneLocalStorage(recipes);
    history.push('/done-recipes');
  }

  render() {
    const { recipes, ingredients, copied, favorited, disable } = this.state;
    return (
      <div>
        <img
          data-testid="recipe-photo"
          src={ recipes.strDrinkThumb }
          alt={ recipes.strDrink }
        />
        <h1 data-testid="recipe-title">{recipes.strDrink}</h1>
        <button
          data-testid="share-btn"
          type="button"
          onClick={ this.shareButton }
        >
          <img src={ shareIcon } alt="share" />
        </button>
        {copied && <p>Link copied!</p>}
        {favorited ? (
          <button
            data-testid="favorite-btn"
            type="button"
            onClick={ this.favoriteRecipe }
            src={ blackHeartIcon }
          >
            <img src={ blackHeartIcon } alt="favoritado" />
          </button>
        ) : (
          <button
            data-testid="favorite-btn"
            type="button"
            onClick={ this.favoriteRecipe }
            src={ whiteHeartIcon }
          >
            <img src={ whiteHeartIcon } alt="n??o favoritado" />
          </button>
        )}
        <span data-testid="recipe-category">{recipes.strCategory}</span>
        {ingredients.map((ingredient, index) => (
          <div key={ ingredient }>
            <label
              htmlFor={ recipes.idDrink }
              data-testid={ `${index}-ingredient-step` }
            >
              {ingredient[2] === true ? (
                <input
                  /* fonte: https://stackoverflow.com/questions/30975459/add-strikethrough-to-checked-checkbox */
                  type="checkbox"
                  id={ recipes.idDrink }
                  name={ ingredient[0] }
                  className="ingredients"
                  onChange={ this.saveIngredients }
                  checked
                />
              ) : (
                <input
                  type="checkbox"
                  id={ recipes.idDrink }
                  name={ ingredient[0] }
                  className="ingredients"
                  onChange={ this.saveIngredients }
                />
              )}
              <span>
                { `${ingredient[0]} - ${ingredient[1]}`}
              </span>
            </label>
          </div>
        ))}
        <p data-testid="instructions">{recipes.strInstructions}</p>
        <button
          data-testid="finish-recipe-btn"
          type="button"
          disabled={ disable }
          onClick={ this.finishRecipe }
        >
          Finish Recipe
        </button>
      </div>
    );
  }
}

ProgFoodRecipe.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;
