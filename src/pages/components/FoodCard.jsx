import React from 'react';
import PropTypes from 'prop-types';

class FoodCard extends React.Component {
  render() {
    const { allRecipes } = this.props;
    return (
      <div>
        {allRecipes.map((recipe, index) => (
          <div key={ recipe.idMeal } data-testid={ `${index}-recipe-card` }>
            <a
              href={ `/foods/${recipe.idMeal}` }
            >
              <img
                src={ recipe.strMealThumb }
                alt={ recipe.strMeal }
                data-testid={ `${index}-card-img` }
              />
              <p data-testid={ `${index}-card-name` }>{ recipe.strMeal }</p>
            </a>
          </div>
        ))}
      </div>
    );
  }
}

FoodCard.propTypes = {
  allRecipes: PropTypes.arrayOf,
}.isRequired;

export default FoodCard;
