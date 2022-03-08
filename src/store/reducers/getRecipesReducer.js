import { RESPONSE_API } from '../actions';

const INITIAL_STATE = {
  recipes: [],
};

export default function getRecipesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case RESPONSE_API:
    return {
      ...state,
      recipes: action.payload,
    };
  default:
    return state;
  }
}
