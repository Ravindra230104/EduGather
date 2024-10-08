import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

const Login = () => {
    const [state, setState] = useState({
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Login',
    });

    useEffect(() => {
        isAuth() && Router.push('/');
    }, []);

    const { email, password, error, success, buttonText } = state;

    const handleChange = (name) => (e) => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Login' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Logging in' });
        try {
            const response = await axios.post(`${API}/login`, {
                email,
                password,
            });

            // Store user data and token in localStorage
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
                error: error.response.data.error,
            });
        }
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div className="form-group mb-3">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    required
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
                        <div className="card p-4" style={{ backgroundColor: 'white', border: '1px solid #dee2e6' }}>
                            <h1 className="text-center mb-4 text-black">Login</h1>
                            {success && showSuccessMessage(success)}
                            {error && showErrorMessage(error)}
                            {loginForm()}
                            <Link href="/auth/password/forgot" legacyBehavior> 
                                <a className='text-danger float-right'>Forgot Password</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
