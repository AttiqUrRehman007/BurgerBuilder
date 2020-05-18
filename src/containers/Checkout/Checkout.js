import React, { Component } from "react";
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";
import { purchaseInit } from '../../store/actions/order';

class Checkout extends Component{

    componentDidMount() {
        this.props.onInitPurchase();
    }

    checkoutSummaryCancelledHandler = () => {
        this.props.history.goBack();
    }
    checkoutSummaryContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render() {
        let summary = <Redirect to="/"/>
        if(this.props.ings){
            const purchasedRedirect = this.props.purchased ? <Redirect to="/" />: null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary
                    ingredients={this.props.ings}
                    checkoutSummaryCancelled={this.checkoutSummaryCancelledHandler}
                    checkoutSummaryContinued={this.checkoutSummaryContinuedHandler}/>
                    <Route path={this.props.match.path + '/contact-data'}
                           component={ContactData} />
                </div>  )
        }
        return summary;
    }
}

const mapStateToProps = (state) => {
    return{
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        onInitPurchase: () => dispatch(purchaseInit())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);