import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getYouTubeID from 'get-youtube-id';
import { detailsFoodFetch } from '../../services/detailsAPI';
import { cocktailsAPIOnLoad } from '../../services/APIsOnLoad';
import '../../styles/btnStartRecipe.css';
import '../../styles/carousel.css';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import { changeFavoritesLocalStorage } from '../../services/changeLocalStorageFood';
import '../../styles/doneRecipes.css';

export default class FoodRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      ingredients: [],
      videoID: '',
      recomendation: [],
      disableStartButton: false,
      showStartButton: true,
      buttonInnerText: 'Iniciar Receita',
      copied: false,
      favorited: false,
    };
  }

  componentDidMount() {
    this.getIdAndApi();
    this.getRecomendationDrinks();
    this.alreadyDone();
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
    const { match: { params: { id } } } = this.props;
    const fetchFood = await detailsFoodFetch(id);
    const ingredients = [];
    const MAX_INGREDIENTS = 20;

    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      if (
        fetchFood[0][`strIngredient${i}`] !== ''
        && fetchFood[0][`strIngredient${i}`] !== null
        && fetchFood[0][`strIngredient${i}`] !== undefined
      ) {
        ingredients.push(
          [fetchFood[0][`strIngredient${i}`], fetchFood[0][`strMeasure${i}`]],
        );
      }
    }

    const videoID = getYouTubeID(fetchFood[0].strYoutube);
    this.setState({
      recipes: fetchFood[0],
      ingredients,
      videoID,
    });

    this.checkFavorited();
    this.recipeInProgress();
  }

  getRecomendationDrinks = async () => {
    const MAX_RECOMENDATION = 6;
    const response = await cocktailsAPIOnLoad();
    const drinks = response.slice(0, MAX_RECOMENDATION);
    this.setState({ recomendation: drinks });
  }

  alreadyDone = () => {
    const { recipes } = this.state;
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    console.log(doneRecipes);
    if (doneRecipes) {
      const check = doneRecipes.map((recipe) => recipe.id === recipes.idMeal);
      if (check) {
        this.setState({ showStartButton: false });
      }
    }
  }

  recipeInProgress = () => {
    const { recipes } = this.state;
    const doneRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    let ids = [];
    if (doneRecipes && doneRecipes.meals) {
      ids = Object.keys(doneRecipes.meals);
      const check = ids.some((id) => id === recipes.idMeal);
      if (check) {
        this.setState({ buttonInnerText: 'Continue Recipe' });
      }
    }
  }

  shareButton = () => {
    const { recipes } = this.state;
    navigator.clipboard.writeText(`http://localhost:3000/foods/${recipes.idMeal}`);
    this.setState({ copied: true });
  }

  favoriteRecipe = () => {
    this.setState(({ favorited }) => ({ favorited: !favorited }),
      this.setLocalStorage());
  }

  setLocalStorage = () => {
    const { recipes, favorited } = this.state;
    changeFavoritesLocalStorage(recipes, favorited);
  };

  render() {
    const {
      recipes,
      ingredients,
      videoID, recomendation,
      disableStartButton,
      buttonInnerText,
      copied,
      favorited,
      showStartButton,
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

        <span data-testid="recipe-category">{ recipes.strCategory }</span>
        {ingredients.map((ingredient, index) => (
          <div key={ ingredient }>
            <p
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {ingredient[0]}
              {' '}
              -
              {' '}
              {ingredient[1]}
            </p>
          </div>
        ))}
        <iframe
          title={ recipes.strMeal }
          data-testid="video"
          width="420"
          height="315"
          src={ `https://www.youtube.com/embed/${videoID}` }
        />
        <section className="recomendation">
          <h4>Recomendações</h4>
          <section className="carousel">
            { recomendation.map((recipe, index) => (
              <div
                data-testid={ `${index}-recomendation-card` }
                key={ recipe.strDrink }
                className="carousel-item"
              >
                <img
                  src={ recipe.strDrinkThumb }
                  alt={ recipe.strDrink }
                  data-testid={ `${index}-card-img` }
                  className="image"
                />
                <p>{ recipe.strCategory }</p>
                <p data-testid={ `${index}-recomendation-title` }>{ recipe.strDrink }</p>
              </div>
            )) }
          </section>
        </section>
        <p data-testid="instructions">{ recipes.strInstructions }</p>
        <footer>
          {showStartButton && (
            <button
              data-testid="start-recipe-btn"
              type="button"
              className="start-recipe"
              disabled={ disableStartButton }
              onClick={ () => history.push(`/foods/${recipes.idMeal}/in-progress`) }
            >
              {buttonInnerText}
            </button>)}
        </footer>
      </div>
    );
  }
}

FoodRecipe.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;
