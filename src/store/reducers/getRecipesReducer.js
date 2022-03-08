import { RESPONSE_API, RECIPE_FOODS_ON_LOAD, RECIPE_DRINKS_ON_LOAD } from '../actions';

const INITIAL_STATE = {
  recipes: [],
  searchFood: false,
  searchDrink: false,
};

export default function getRecipesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case RESPONSE_API:
    return {
      ...state,
      recipes: action.payload,
    };
  case RECIPE_FOODS_ON_LOAD:
    return {
      ...state,
      searchFood: action.payload,
    };
  case RECIPE_DRINKS_ON_LOAD:
    return {
      ...state,
      searchDrink: action.payload,
    };
  default:
    return state;
  }
}
