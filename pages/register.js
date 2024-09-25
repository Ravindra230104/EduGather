import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

const Register = () => {
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register',
        loadedCategories: [],
        categories: []
    });

    useEffect(() => {
        isAuth() && Router.push('/');
    }, []);

    const { name, email, password, error, success, buttonText, loadedCategories, categories } = state;

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await axios.get(`${API}/categories`);
            setState({ ...state, loadedCategories: response.data });
            console.log("Loaded Categories:", response.data); // Debugging
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const handleToggle = (c) => {
        return () => {
            const clickedCategory = categories.indexOf(c);
            const all = [...categories];

            if (clickedCategory === -1) {
                all.push(c);
            } else {
                all.splice(clickedCategory, 1);
            }
            setState({ ...state, categories: all, success: '', error: '' });
            console.log("Selected Categories:", all); // Debugging
        };
    };

    const showCategories = () => {
        return loadedCategories && loadedCategories.length > 0 ? (
            <div className="form-check">
                {loadedCategories.map((c) => (
                    <div key={c._id} className="category-item">
                        <input
                            type="checkbox"
                            onChange={handleToggle(c._id)}
                            id={`category-${c._id}`}
                            className="form-check-input"
                            checked={categories.includes(c._id)}
                        />
                        <label htmlFor={`category-${c._id}`} className="form-check-label">{c.name}</label>
                    </div>
                ))}
            </div>
        ) : (
            <p>No categories available</p>
        );
    };

    const handleChange = (name) => (e) => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Register' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Registering' });
        try {
            const response = await axios.post(`${API}/register`, {
                name,
                email,
                password,
                categories
            });
            console.log(response);
            setState({
                ...state,
                name: '',
                email: '',
                password: '',
                buttonText: 'Submitted',
                success: response.data.message
            });
        } catch (error) {
            console.log(error);
            setState({ ...state, buttonText: 'Register', error: error.response.data.message });
        }
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <input
                    value={name}
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    placeholder="Enter your Name"
                    required
                />
            </div>
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
            <div className="form-group mb-4">
                <label className='text-dark'>Choose your favourite Category</label>
                <ul style={{ maxHeight: '230px', overflowY: 'scroll', paddingLeft: '0' }}>
                    {showCategories()}
                </ul>
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
                            <h1 className="text-center mb-4 text-black">Register</h1>
                            {success && showSuccessMessage(success)}
                            {error && showErrorMessage(error)}
                            {registerForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
