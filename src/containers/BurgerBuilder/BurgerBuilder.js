import React, {Component} from "react";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICE = {
    salad: 0.4,
    cheese: 0.5,
    meat: 1.4,
    bacon: 0.7
}


class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 3,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    componentDidMount() {
        axios.get('https://react-my-burger-d86fb.firebaseio.com/ingredients.json')
            .then((response) => {
                this.setState({ingredients: response.data})
            }).catch((err) => {
                this.setState({error: true})
        })
    }

    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients).map((igKey) =>{
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0)
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1;
        const updatedIngredient = {
            ...this.state.ingredients
        };
        updatedIngredient[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ingredients: updatedIngredient, totalPrice: newPrice});
        this.updatePurchaseState(updatedIngredient);

    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredient = {
            ...this.state.ingredients
        };
        updatedIngredient[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({ingredients: updatedIngredient, totalPrice: newPrice});
        this.updatePurchaseState(updatedIngredient);
    }
    purchaseHandler = ()=> {
        this.setState({purchasing: true})
    }
    purchaseCancelHandler = ()=> {
        this.setState({purchasing: false})
    }
    purchaseContinueHandler = () => {
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price' + '=' + this.state.totalPrice)
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        }
        for (let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0;
        }

        let orderSummary = null
        let burger = this.state.error ? <p style={{textAlign: 'center'}}></p>:  <Spinner />
        if(this.state.ingredients){
            burger = ( <Auxiliary>
                                 <Burger  ingredients={this.state.ingredients}/>
                                        <BuildControls
                                            ingredientAdded={this.addIngredientHandler}
                                            ingredientRemoved={this.removeIngredientHandler}
                                            disabled={disableInfo}
                                            purchasable={this.state.purchasable}
                                            price={this.state.totalPrice}
                                            ordered={this.purchaseHandler}/>
                          </Auxiliary>)
            orderSummary =    <OrderSummary
                        purchasedCancel={this.purchaseCancelHandler}
                        purchasedContinue={this.purchaseContinueHandler}
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}/>;
        }
        if (this.state.loading){
            orderSummary = <Spinner />
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

export default withErrorHandler(BurgerBuilder, axios);