import { Recipe } from '../../pages/RecipeForm';
import { ADD_RECIPE } from '../constants/recipeConstants';

interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
};

export const recipeReducer = (state = initialState, action: any): RecipeState => {
  switch (action.type) {
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    default:
      return state;
  }
};
