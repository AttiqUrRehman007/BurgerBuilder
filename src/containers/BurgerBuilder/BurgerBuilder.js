import React, {Component} from "react";
import { connect } from 'react-redux'
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import {addIngredient, removeIngredient, initIngredient} from '../../store/actions/burgerBuilder'
import { purchaseInit } from '../../store/actions/order';
import {setAuthRedirectPath} from "../../store/actions/auth";

export class BurgerBuilder extends Component{
    state = {
        purchasing: false
    }
    componentDidMount() {
        this.props.onInitIngredient()
    }

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients).map((igKey) =>{
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0)
        return sum > 0;
    }

    purchaseHandler = ()=> {
        if(this.props.isAuthenticated){
            this.setState({purchasing: true})
        }else {
            this.props.onSetRedirectPath('/checkout')
            this.props.history.push('/auth');
        }

    }
    purchaseCancelHandler = ()=> {
        this.setState({purchasing: false})
    }
    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        const disableInfo = {
            ...this.props.ings
        }
        for (let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0;
        }

        let orderSummary = null
        let burger = this.props.error ? <p style={{textAlign: 'center'}}></p>:  <Spinner />
        if(this.props.ings){
            burger = ( <Auxiliary>
                                 <Burger  ingredients={this.props.ings}/>
                                        <BuildControls
                                            ingredientAdded={this.props.onIngredientAdded}
                                            ingredientRemoved={this.props.onIngredientRemove}
                                            disabled={disableInfo}
                                            purchasable={this.updatePurchaseState(this.props.ings)}
                                            price={this.props.price}
                                            isAuth={this.props.isAuthenticated}
                                            ordered={this.purchaseHandler}/>
                          </Auxiliary>)
            orderSummary =    <OrderSummary
                        purchasedCancel={this.purchaseCancelHandler}
                        purchasedContinue={this.purchaseContinueHandler}
                        ingredients={this.props.ings}
                        price={this.props.price}/>;
        }
        return (
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>

            )}
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        onIngredientAdded: (ingName) => dispatch(addIngredient(ingName)),
        onIngredientRemove: (ingName) => dispatch(removeIngredient(ingName)),
        onInitIngredient: () => dispatch(initIngredient()),
        onInitPurchase: () => dispatch(purchaseInit()),
        onSetRedirectPath: (path) => dispatch(setAuthRedirectPath(path))
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));