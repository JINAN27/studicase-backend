import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { thunk } from 'redux-thunk'; // Gunakan named import untuk `thunk`
import authReducer from './features/Auth/reducer';
import cartReducer from './features/Cart/reducer';
import productReducer from './features/Product/reducer';

// Setup untuk Redux DevTools Extension
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Gabungkan semua reducer menjadi rootReducer
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer
});

// Buat store dengan middleware thunk dan dukungan DevTools jika tersedia
const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
