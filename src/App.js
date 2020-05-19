import React,{Component} from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import {authCheckState} from "./store/actions/auth";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";
import Orders from "./containers/Orders/Orders";
import Auth from "./Auth/Auth";
import Logout from "./Auth/Logout/Logout";

class App extends Component{
    componentDidMount() {
        this.props.onTryAutoSignup()
    }
    render() {
        let routes = (
        <Switch>
            <Route path='/auth' component={Auth}/>
            <Route path='/' exact component={BurgerBuilder}/>
            <Redirect to='/' />
        </Switch>
        )
        if (this.props.isAuthenticated){
           routes= <Switch>
                <Route path='/checkout' component={Checkout}/>
                <Route path='/orders' component={Orders}/>
                <Route path='/logout' component={Logout}/>
                <Route path='/' exact component={BurgerBuilder}/>
               <Redirect to='/' />
            </Switch>
        }
  return(
      <div>
            <Layout>
                {routes}
            </Layout>
      </div>)
}
}
const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        onTryAutoSignup: () => dispatch(authCheckState())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
