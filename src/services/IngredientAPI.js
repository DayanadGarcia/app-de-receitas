export async function ingredientFoodAPI(ingredient) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const result = await response.json();
  return result.meals;
}

export async function ingredientCocktailAPI(ingredient) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const result = await response.json();
  return result.drinks;
}
