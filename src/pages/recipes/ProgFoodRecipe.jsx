import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { detailsFoodFetch } from '../../services/detailsAPI';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import '../../styles/progFoodRecipe.css';

export default class ProgFoodRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      ingredients: [],
      copied: false,
      favorited: false,
      checkboxChecked: [],
    };
  }

  componentDidMount() {
    this.getIdAndApi();
  }

  getIdAndApi = async () => {
    const { match: { params: { id } } } = this.props;
    const fetchFood = await detailsFoodFetch(id);
    let ingredients = [];
    const MAX_INGREDIENTS = 20;

    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      if (fetchFood[0][`strIngredient${i}`] === ''
      || fetchFood[0][`strIngredient${i}`] === null) {
        ingredients = [...ingredients];
      } else {
        ingredients.push(
          [fetchFood[0][`strIngredient${i}`], fetchFood[0][`strMeasure${i}`]],
        );
      }
    }

    this.setState({
      recipes: fetchFood[0],
      ingredients,
    });

    this.getRecipesInProgress();
  }

  getRecipesInProgress = () => {
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const { recipes } = this.state;
    const id = recipes.idMeal;

    this.setState({
      checkboxChecked: inProgress.meals[id],
    });
  }

  isChecked = ({ target }) => {
    const { checkboxChecked } = this.state;

    const checkedResult = checkboxChecked.some((checkbox) => checkbox === target.name);

    if (checkedResult) {
      return target.isChecked;
    }
  }

  shareButton = () => {
    const { recipes } = this.state;
    navigator.clipboard.writeText(`http://localhost:3000/foods/${recipes.idMeal}`);
    this.setState({ copied: true });
  }

  favoriteRecipe = () => {
    this.setState(({ favorited }) => ({ favorited: !favorited }),
      this.changeLocalStorage());
  }

  changeLocalStorage = () => {
    const { recipes, favorited } = this.state;
    const allFavorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const favorite = {
      id: recipes.idMeal,
      type: 'food',
      nationality: recipes.strArea,
      category: recipes.strCategory,
      alcoholicOrNot: '',
      name: recipes.strMeal,
      image: recipes.strMealThumb,
    };

    if (!favorited) {
      if (allFavorites !== null) {
        if (allFavorites.length > 0) {
          allFavorites.push(favorite);
          localStorage.setItem('favoriteRecipes', JSON.stringify(allFavorites));
        } else {
          localStorage.setItem('favoriteRecipes', JSON.stringify([favorite]));
        }
      }
    } else {
      const newFavorites = allFavorites.filter((recipe) => recipe.id !== recipes.idMeal);
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    }
  }

  saveIngredientsTeste = (recipeId, ingredient, addFirstMeal, inProgress) => {
    // caso ja exista alguma comida salva no localstorage
    if (inProgress.meals !== null) {
      // caso ja exista algum ingrediente daquela comida salvo no localstorage
      if (inProgress.meals[recipeId] !== null) {
        if (inProgress.meals[recipeId] !== undefined) {
          let savedIngredients = inProgress.meals[recipeId];
          const isSaved = savedIngredients.some((savedIngredient) => (
            savedIngredient === ingredient));
          // caso ja exista aquele ingrediente salvo no localstorage
          if (isSaved) {
            savedIngredients = [...savedIngredients];
          // caso o ingrediente ainda não eseteja salvo no localstorage
          } else {
            savedIngredients = [...savedIngredients, ingredient];
          }

          const meals = { ...inProgress.meals, [recipeId]: savedIngredients };

          inProgress = { ...inProgress, meals };

          localStorage.setItem('inProgressRecipes', JSON.stringify(inProgress));
        } else {
          const meals = { ...inProgress.meals, [recipeId]: [ingredient] };

          inProgress = { ...inProgress, meals };

          localStorage.setItem('inProgressRecipes', JSON.stringify(inProgress));
        }
      }
    // caso exista algo salvo no localstorage, mas que não seja alguma comida
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify(addFirstMeal));
    }
  }

  saveIngredients = ({ target }) => {
    const recipeId = target.id;
    const ingredient = target.name;
    const addFirstMeal = { meals: { [recipeId]: [ingredient] } };
    const inProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));

    // caso ja exista algo salvo no localstorage em progresso
    if (inProgress !== null) {
      this.saveIngredientsTeste(recipeId, ingredient, addFirstMeal, inProgress);
    // caso não exista nada salvo no localstorage ainda
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify(addFirstMeal));
    }
  }

  render() {
    const {
      recipes,
      ingredients,
      copied,
      favorited,
    } = this.state;
    const { history } = this.props;

    return (
      <div>
        <img
          data-testid="recipe-photo"
          src={ recipes.strMealThumb }
          alt={ recipes.strMeal }
        />
        <h1 data-testid="recipe-title">{ recipes.strMeal }</h1>

        <button
          data-testid="share-btn"
          type="button"
          onClick={ this.shareButton }
        >
          <img src={ shareIcon } alt="share" />
        </button>
        { copied && <p>Link copied!</p>}

        <button
          data-testid="favorite-btn"
          type="button"
          onClick={ this.favoriteRecipe }
        >
          {favorited ? (
            <img src={ blackHeartIcon } alt="favoritado" />)
            : (<img src={ whiteHeartIcon } alt="não favoritado" />)}
        </button>

        <span data-testid="recipe-category">{ recipes.strCategory }</span>
        {ingredients.map((ingredient, index) => (
          <div key={ ingredient }>
            <label htmlFor={ recipes.idMeal } data-testid={ `${index}-ingredient-step` }>
              <input
                /* fonte: https://stackoverflow.com/questions/30975459/add-strikethrough-to-checked-checkbox */
                type="checkbox"
                id={ recipes.idMeal }
                name={ `${ingredient[0]} - ${ingredient[1]}` }
                className="ingredients"
                onClick={ this.saveIngredients }
                onChange={ this.isChecked }
              />
              <span>
                {ingredient[0]}
                {' '}
                -
                {' '}
                {ingredient[1]}
              </span>
            </label>
          </div>
        ))}
        <p data-testid="instructions">{ recipes.strInstructions }</p>
        <button
          data-testid="finish-recipe-btn"
          type="button"
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
