export async function nameFoodAPI(name) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  const result = await response.json();
  return result.meals;
}

export async function nameCocktailAPI(name) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
  const result = await response.json();
  return result.drinks;
}
