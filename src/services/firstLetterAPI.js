export async function firstLetterFoodAPI(letter) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  const result = await response.json();
  return result.meals;
}

export async function firstLetterCocktailAPI(letter) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
  const result = await response.json();
  return result.drinks;
}
