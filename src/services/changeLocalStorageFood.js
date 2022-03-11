export const changeFavoritesLocalStorage = (recipes, favorited) => {
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

  if (allFavorites !== null) {
    if (!favorited) {
      if (allFavorites.length > 0) {
        allFavorites.push(favorite);
        localStorage.setItem('favoriteRecipes', JSON.stringify(allFavorites));
      } else {
        localStorage.setItem('favoriteRecipes', JSON.stringify([favorite]));
      }
    } else {
      const newFavorites = allFavorites.filter(
        (recipe) => recipe.id !== recipes.idMeal,
      );
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    }
  } else {
    localStorage.setItem('favoriteRecipes', JSON.stringify([favorite]));
  }
};

export const changeIngredientsInProgressLocalStorage = (recipeId,
  ingredient, addFirstMeal, inProgress) => {
  // caso ja exista alguma comida salva no localstorage
  if (inProgress.meals !== null) {
    // caso ja exista algum ingrediente daquela comida salvo no localstorage
    if (inProgress.meals[recipeId] !== null) {
      if (inProgress.meals[recipeId] !== undefined) {
        let savedIngredients = inProgress.meals[recipeId];
        const isSaved = savedIngredients.some(
          (savedIngredient) => savedIngredient === ingredient,
        );
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
};
