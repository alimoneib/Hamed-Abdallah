import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';
export const Store = createContext();

const initialState = {
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : {},
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.name === newItem.name
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      document.cookie = `cartItems=${JSON.stringify(cartItems)}`;
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      document.cookie = `cartItems=${JSON.stringify(cartItems)}`;
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'USER_LOGIN': {
      document.cookie = `userInfo=${JSON.stringify(action.payload)}`;

      return { ...state, userInfo: action.payload };
    }
    case 'USER_LOGOUT': {
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };
    }
    case 'SAVE_SHIPPING_ADDRESS': {
      document.cookie = `shippingAddress=${JSON.stringify(action.payload)}`;
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }
    case 'SAVE_PAYMENT_METHOD': {
      document.cookie = `paymentMethod=${JSON.stringify(action.payload)}`;
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    }
    case 'CART_CLEAR': {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    case 'ADD_FILTER_QUERY': {
      document.cookie = `shopFilterQuery=${JSON.stringify(action.payload)}`;
      return {
        ...state,
        shopFilterQuery: action.payload,
      };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
