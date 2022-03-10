import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { detailsFoodFetch } from '../../services/detailsAPI';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
// import '../../styles/progFoodRecipe.css';

export default class ProgFoodRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      ingredients: [],
      copied: false,
      favorited: false,
    };
  }

  componentDidMount() {
    this.getIdAndApi();
  }

  getIdAndApi = async () => {
    const { match: { params: { id } } } = this.props;
    const fetchFood = await detailsFoodFetch(id);
    const ingredients = [];
    const MAX_INGREDIENTS = 20;

    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      console.log(`O texto do index ${i} é: `);
      console.log(fetchFood[0][`strIngredient${i}`]);
      if (fetchFood[0][`strIngredient${i}`] === ''
      || fetchFood[0][`strIngredient${i}`] === null) {
        console.log('Entrou no if');
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
    console.log(allFavorites);
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
          console.log(allFavorites);
        } else {
          localStorage.setItem('favoriteRecipes', JSON.stringify([favorite]));
        }
      }
    } else {
      const newFavorites = allFavorites.filter((recipe) => recipe.id !== recipes.idMeal);
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    }
  }

  classList() {

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
            <label htmlFor="ingredientsList" data-testid={ `${index}-ingredient-step` }>
              <input
                /* fonte: https://stackoverflow.com/questions/30975459/add-strikethrough-to-checked-checkbox */
                type="checkbox"
                name="ingredientsList"
                className="ingredients"
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
