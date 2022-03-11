import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { detailsFoodFetch } from '../../services/detailsAPI';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import '../../styles/progRecipe.css';
import { changeFavoritesLocalStorage,
  changeIngredientsInProgressLocalStorage } from '../../services/changeLocalStorageFood';

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
        favorited: favorites.find((favorite) => favorite.id === recipes.idMeal),
      });
    }
  }

  getIdAndApi = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const fetchFood = await detailsFoodFetch(id);
    let ingredients = [];
    const MAX_INGREDIENTS = 20;

    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      if (
        fetchFood[0][`strIngredient${i}`] === ''
        || fetchFood[0][`strIngredient${i}`] === null
      ) {
        ingredients = [...ingredients];
      } else {
        ingredients.push([
          fetchFood[0][`strIngredient${i}`],
          fetchFood[0][`strMeasure${i}`],
        ]);
      }
    }

    this.setState({
      recipes: fetchFood[0],
      ingredients,
    });

    this.getRecipesInProgress();
    this.checkFavorited();
  };

  getRecipesInProgress = () => {
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const { recipes } = this.state;
    const id = recipes.idMeal;

    if (inProgress !== null) {
      this.isChecked(inProgress.meals[id]);
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
      `http://localhost:3000/foods/${recipes.idMeal}`,
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
    const addFirstMeal = { meals: { [recipeId]: [ingredient] } };
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));

    this.disabledButton(false);
    // caso ja exista algo salvo no localstorage em progresso
    if (inProgress !== null) {
      changeIngredientsInProgressLocalStorage(recipeId,
        ingredient, addFirstMeal, inProgress);
      // caso não exista nada salvo no localstorage ainda
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify(addFirstMeal));
    }
  };

  disabledButton = (onLoad) => {
    const { ingredients, recipes } = this.state;
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    let result = true;

    if (inProgress) {
      if (onLoad) {
        result = inProgress.meals[recipes.idMeal].length !== (ingredients.length);
      } else {
        result = inProgress.meals[recipes.idMeal].length !== (ingredients.length - 1);
      }
    }
    this.setState({
      disable: result,
    });
  }

  render() {
    const { recipes, ingredients, copied, favorited, disable } = this.state;
    const { history } = this.props;

    return (
      <div>
        <img
          data-testid="recipe-photo"
          src={ recipes.strMealThumb }
          alt={ recipes.strMeal }
        />
        <h1 data-testid="recipe-title">{recipes.strMeal}</h1>

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
            <img src={ whiteHeartIcon } alt="não favoritado" />
          </button>
        )}

        <span data-testid="recipe-category">{recipes.strCategory}</span>
        {ingredients.map((ingredient, index) => (
          <div key={ ingredient }>
            <label
              htmlFor={ recipes.idMeal }
              data-testid={ `${index}-ingredient-step` }
            >
              {ingredient[2] === true ? (
                <input
                  /* fonte: https://stackoverflow.com/questions/30975459/add-strikethrough-to-checked-checkbox */
                  type="checkbox"
                  id={ recipes.idMeal }
                  name={ ingredient[0] }
                  className="ingredients"
                  onChange={ this.saveIngredients }
                  checked
                />
              ) : (
                <input
                  type="checkbox"
                  id={ recipes.idMeal }
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
          onClick={ () => history.push('/done-recipes') }
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
