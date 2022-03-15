import React, { Component } from 'react';
import PropTypes from 'prop-types';
// video do youtube para comidas
import { detailsDrinkFetch } from '../../services/detailsAPI';
import { foodsAPIOnLoad } from '../../services/APIsOnLoad';
import '../../styles/btnStartRecipe.css';
import '../../styles/carousel.css';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import { changeFavoritesLocalStorage } from '../../services/changeLocalStorageDrink';
import '../../styles/doneRecipes.css';

export default class DrinkRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      ingredients: [],
      // videoID: '',
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
    this.getRecomendationFoods();
    this.alreadyDone();
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
    const { match: { params: { id } } } = this.props;
    const fetchDrink = await detailsDrinkFetch(id);
    const ingredients = [];
    const MAX_INGREDIENTS = 20;

    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      if (
        fetchDrink[0][`strIngredient${i}`] !== ''
        && fetchDrink[0][`strIngredient${i}`] !== null
        && fetchDrink[0][`strIngredient${i}`] !== undefined
      ) {
        ingredients.push(
          [fetchDrink[0][`strIngredient${i}`], fetchDrink[0][`strMeasure${i}`]],
        );
      }
    }
    this.setState({
      recipes: fetchDrink[0],
      ingredients,
    });

    this.checkFavorited();
    this.recipeInProgress();
  }

  getRecomendationFoods = async () => {
    const MAX_RECOMENDATION = 6;
    const response = await foodsAPIOnLoad();
    const foods = response.slice(0, MAX_RECOMENDATION);
    this.setState({ recomendation: foods });
  }

  alreadyDone = () => {
    const { recipes } = this.state;
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    if (doneRecipes) {
      const check = doneRecipes.map((recipe) => recipe.id === recipes.idDrink);
      if (check) {
        this.setState({ showStartButton: false });
      }
    }
  }

  recipeInProgress = () => {
    const { recipes } = this.state;
    const doneRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    let ids = [];
    if (doneRecipes && doneRecipes.cocktails) {
      ids = Object.keys(doneRecipes.cocktails);
      const check = ids.some((id) => id === recipes.idDrink);
      if (check) {
        this.setState({ buttonInnerText: 'Continue Recipe' });
      }
    }
  }

  shareButton = () => {
    const { recipes } = this.state;
    navigator.clipboard.writeText(`http://localhost:3000/drinks/${recipes.idDrink}`);
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
      recomendation,
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
          src={ recipes.strDrinkThumb }
          alt={ recipes.strDrink }
        />
        <h1 data-testid="recipe-title">{ recipes.strDrink }</h1>

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

        { recipes.strAlcoholic === 'Alcoholic'
          ? <span data-testid="recipe-category">Alcoholic</span>
          : <span data-testid="recipe-category">Non alcoholic</span>}
        {ingredients.map((ingredient, index) => (
          <div key={ index }>
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
        <section className="recomendation">
          <h4>Recomendações</h4>
          <section className="carousel">
            { recomendation.map((recipe, index) => (
              <div
                data-testid={ `${index}-recomendation-card` }
                key={ recipe.strMeal }
                className="carousel-item"
              >
                <img
                  src={ recipe.strMealThumb }
                  alt={ recipe.strMeal }
                  data-testid={ `${index}-card-img` }
                  className="image"
                />
                <p>{ recipe.strCategory }</p>
                <p data-testid={ `${index}-recomendation-title` }>{ recipe.strMeal }</p>
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
              onClick={ () => history.push(`/drinks/${recipes.idDrink}/in-progress`) }
            >
              {buttonInnerText}
            </button>)}
        </footer>
      </div>
    );
  }
}

DrinkRecipe.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;
