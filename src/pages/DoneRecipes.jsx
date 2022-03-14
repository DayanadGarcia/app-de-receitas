import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';
import shareIcon from '../images/shareIcon.svg';
import '../styles/doneRecipes.css';

export default class DoneRecipes extends Component {
  constructor() {
    super();

    this.state = {
      allRecipes: [],
      copied: false,
    };
  }

  componentDidMount() {
    this.getRecipesFromStorage();
  }

  getRecipesFromStorage = () => {
    const allRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    this.setState({ allRecipes });
    console.log(allRecipes);
  }

  filterFoodsOrDrinks = (type) => {
    const { allRecipes } = this.state;
    const filter = allRecipes.filter((recipe) => recipe.type === type);
    this.setState({ allRecipes: filter });
  }

  shareButton = (id) => {
    navigator.clipboard.writeText(
      `http://localhost:3000/foods/${id}`,
    );
    this.setState({ copied: true });
  };

  render() {
    const { allRecipes, copied } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Header history={ history } name="Done Recipes" hideSearch />
        <button
          data-testid="filter-by-all-btn"
          type="button"
          onClick={ this.getRecipesFromStorage }
        >
          All
        </button>

        <button
          data-testid="filter-by-food-btn"
          type="button"
          onClick={ () => this.filterFoodsOrDrinks('food') }
        >
          Foods
        </button>

        <button
          data-testid="filter-by-drink-btn"
          type="button"
          onClick={ () => this.filterFoodsOrDrinks('drink') }
        >
          Drinks
        </button>

        {copied && <p>Link copied!</p>}

        {allRecipes && allRecipes.map((recipe, index) => {
          if (recipe.type === 'food') {
            return (
              <div key={ recipe.name }>
                <a
                  href={ `/foods/${recipe.id}` }
                >
                  <img
                    src={ recipe.image }
                    alt={ recipe.name }
                    data-testid={ `${index}-horizontal-image` }
                    className="image"
                  />
                  <h4 data-testid={ `${index}-horizontal-name` }>{recipe.name}</h4>
                </a>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${recipe.nationality} - ${recipe.category}`}
                </p>
                <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>
                {recipe.tags && (
                  <div>
                    <p data-testid={ `${index}-${recipe.tags[0]}-horizontal-tag` }>
                      {recipe.tags[0]}
                    </p>
                    <p data-testid={ `${index}-${recipe.tags[1]}-horizontal-tag` }>
                      {recipe.tags[1]}
                    </p>
                  </div>
                )}

                <button
                  data-testid={ `${index}-horizontal-share-btn` }
                  type="button"
                  onClick={ () => this.shareButton(recipe.id) }
                  src={ shareIcon }
                >
                  <img src={ shareIcon } alt="share" />
                </button>
              </div>
            );
          }
          return (
            <div key={ recipe.name }>
              <a
                href={ `/drinks/${recipe.id}` }
              >
                <img
                  src={ recipe.image }
                  alt={ recipe.name }
                  data-testid={ `${index}-horizontal-image` }
                  className="image"
                />
                <h4 data-testid={ `${index}-horizontal-name` }>{recipe.name}</h4>
              </a>
              <p data-testid={ `${index}-horizontal-top-text` }>
                {`${recipe.category} - ${recipe.alcoholicOrNot}`}
              </p>
              <p data-testid={ `${index}-horizontal-done-date` }>{recipe.data}</p>
              <button
                data-testid={ `${index}-horizontal-share-btn` }
                type="button"
                onClick={ () => this.shareButton(recipe.id) }
                src={ shareIcon }
              >
                <img src={ shareIcon } alt="share" />
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

DoneRecipes.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
