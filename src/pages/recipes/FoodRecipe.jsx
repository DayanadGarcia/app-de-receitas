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

export default class FoodRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      ingredients: [],
      videoID: '',
      recomendation: [],
      disableStartButton: false,
      buttonInnerText: 'Iniciar Receita',
      copied: false,
      favorited: false,
    };
  }

  componentDidMount() {
    this.getIdAndApi();
    this.getRecomendationDrinks();
    // a função a baixo precisa fazer a página de done recipes pra passar no REQ 39
    // this.alreadyDone();
    // a função a baixo precisa fazer a página de recipes in progress pra passar no REQ 40
    // recipeInProgress();
  }

  getIdAndApi = async () => {
    const { match: { params: { id } } } = this.props;
    const fetchFood = await detailsFoodFetch(id);
    console.log(fetchFood[0]);
    const ingredients = [];
    const MAX_INGREDIENTS = 20;
    for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
      if (fetchFood[0][`strIngredient${i}`] !== '') {
        ingredients.push(
          [fetchFood[0][`strIngredient${i}`], fetchFood[0][`strMeasure${i}`]],
        );
      }
    }
    console.log(ingredients);
    const videoID = getYouTubeID(fetchFood[0].strYoutube);
    this.setState({
      recipes: fetchFood[0],
      ingredients,
      videoID,
    });
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
    const check = doneRecipes.find((recipe) => recipe.id === recipes.idMeal);
    if (check) {
      this.setState({ disableStartButton: true });
    }
  }

  recipeInProgress = () => {
    const { recipes } = this.state;
    const doneRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const check = doneRecipes.find((recipe) => recipe.id === recipes.idMeal);
    if (check) {
      this.setState({ disableStartButton: true, buttonInnerText: 'Continue Recipe' });
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

  render() {
    const {
      recipes,
      ingredients,
      videoID, recomendation,
      disableStartButton,
      buttonInnerText,
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
                />
                <p>{ recipe.strCategory }</p>
                <p data-testid={ `${index}-recomendation-title` }>{ recipe.strDrink }</p>
              </div>
            )) }
          </section>
        </section>
        <p data-testid="instructions">{ recipes.strInstructions }</p>
        <footer>
          <button
            data-testid="start-recipe-btn"
            type="button"
            className="start-recipe"
            disabled={ disableStartButton }
            onClick={ () => history.push(`/foods/${recipes.idMeal}/in-progress`) }
          >
            {buttonInnerText}
          </button>
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
