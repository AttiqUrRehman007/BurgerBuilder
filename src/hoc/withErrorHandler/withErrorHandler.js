import React, {Component} from "react";
import Modal from "../../components/UI/Modal/Modal";
import Auxiliary from "../Auxiliary/Auxiliary";

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component{
        state = {
            error: null
        }
        componentDidMount() {
           this.reqInterceptor = axios.interceptors.request.use((request) => {
                this.setState({error: null})
                return request;
            })
            this.resInterceptor = axios.interceptors.response.use((response) => {
                return response;
            }, error => {
                this.setState({error: error})
            })
        }
        errorConfirmedHandler = () => {
            this.setState({error: null})
        }
        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        render() {
            return (
                <Auxiliary>
                    <Modal
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message: null}
                        Something didn't work!
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Auxiliary>

            )
        }

    }
}

export default withErrorHandler;