import Layout from '../components/Layout';
import { useState } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

const GuestLogin = () => {
    const [state, setState] = useState({
        email: 'ravindrasapkal2304@gmail.com',
        password: '121212',
        error: '',
        success: '',
        buttonText: 'Login',
    });

    const { email, password, error, success, buttonText } = state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Logging in' });
        try {
            const response = await axios.post(`${API}/guestlogin`, {
                email,
                password,
            });

            authenticate(response, () => {
                if (isAuth() && isAuth().role === 'admin') {
                    Router.push('/admin');
                } else {
                    Router.push('/user');
                }
            });
        } catch (error) {
            console.log(error);
            setState({
                ...state,
                buttonText: 'Login',
                error: (error.response && error.response.data && error.response.data.error) || 'Something went wrong. Please try again.',
            });
        }
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <input
                    value={email}
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    readOnly
                />
            </div>
            <div className="form-group mb-3">
                <input
                    value={password}
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    readOnly
                />
            </div>
            <div className="form-group mb-3">
                <button className="btn btn-outline-warning w-100">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card p-4" style={{ backgroundColor: 'black', border: '1px solid #dee2e6' }}>
                            <h1 className="text-center mb-4 text-white">Guest Login</h1>
                            {success && showSuccessMessage(success)}
                            {error && showErrorMessage(error)}
                            {loginForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default GuestLogin;
