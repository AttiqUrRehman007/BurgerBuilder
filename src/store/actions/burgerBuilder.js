import * as actionType from './actionTypes';
import axios from "../../axios-order";

export const addIngredient = (name) => {
    return{
        type: actionType.ADD_INGREDIENT,
        ingredientName: name
    }
}

export const removeIngredient = (name) => {
    return{
        type: actionType.REMOVE_INGREDIENT,
        ingredientName: name
    }
}

export const setIngredient = (ingredients) => {
    return{
        type: actionType.SET_INGREDIENTS,
        ingredients: ingredients
    }
}

export const fetchIngredientFailed = () => {
    return{
        type: actionType.FETCH_INGREDIENT_FAILED
    }
}

export const initIngredient = () => {
    return (dispatch) => {
        axios.get('https://react-my-burger-d86fb.firebaseio.com/ingredients.json')
            .then((response) => {
                dispatch(setIngredient(response.data))
            }).catch((err) => {
                dispatch(fetchIngredientFailed())
        })
    }
}