import React from "react";
import classes from './Burger.module.css';
import BurgerIngredients from "./BurgerIngredients/BurgerIngredients";


const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients).map((igkeys) => {
        return [...Array(props.ingredients[igkeys])].map((_, i) => {
          return <BurgerIngredients key={igkeys + i} type={igkeys}/>
        })
    }).reduce((arr, el)=> {
        return arr.concat(el)
    }, [])
  
    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please Starting adding Ingredients</p>
    }
        return(
            <div className={classes.Burger}>
                <BurgerIngredients type='bread-top'/>
                {transformedIngredients}
                <BurgerIngredients type='bread-bottom'/>
            </div>
        )
}

export default burger;