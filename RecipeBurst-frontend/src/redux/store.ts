// store.ts
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import { recipeReducer } from './reducers/recipeReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  recipes: recipeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
