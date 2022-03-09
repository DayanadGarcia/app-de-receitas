import React from 'react';
import PropTypes from 'prop-types';

class DrinkCard extends React.Component {
  render() {
    const { allRecipes } = this.props;
    return (
      <div>
        {allRecipes.map((recipe, index) => (
          <div data-testid={ `${index}-recipe-card` } key={ recipe.idDrink }>
            <a href={ `/drinks/${recipe.idDrink}` }>
              <img
                src={ recipe.strDrinkThumb }
                alt={ recipe.strDrink }
                data-testid={ `${index}-card-img` }
              />
              <p data-testid={ `${index}-card-name` }>{ recipe.strDrink }</p>
            </a>
          </div>
        ))}
      </div>
    );
  }
}

DrinkCard.propTypes = {
  allRecipes: PropTypes.arrayOf,
}.isRequired;

export default DrinkCard;
