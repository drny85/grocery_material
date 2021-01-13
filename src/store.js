import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import userReducer from './reduxStore/reducers/userReducer'
// import categoriesReducer from './reduxStore/reducers/categoriesReducer.'
import ordersReducer from './reduxStore/reducers/ordersReducer'
// import productsReducer from './reduxStore/reducers/productsReducer'
// import cartReducer from './reduxStore/reducers/shoppingCartReducer'




const reducer = combineReducers({
    // productsData: productsReducer,
    // cartData: cartReducer,
    userData: userReducer,
    // categoriesData: categoriesReducer,
    ordersData: ordersReducer
})


const store = createStore(reducer, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))


export default store;