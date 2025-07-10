import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import withUser from '../../withUser';
import React from 'react';
import { getCookie, isAuth } from '../../../helpers/auth';

const Create = ({ token }) => {
    const [state, setState] = useState({
        title: '',
        url: '',
        categories: [],
        loadedCategories: [],
        success: '',
        error: '',
        type: '',
        medium: ''
    });

    const { title, url, categories, loadedCategories, success, error, type, medium } = state;

    useEffect(() => {
        loadCategories();
    }, [success]);

    const loadCategories = async () => {
        try {
            const response = await axios.get(`${API}/categories`);
            setState({ ...state, loadedCategories: response.data });
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const handleTitleChange = e => {
        setState({ ...state, title: e.target.value, error: '', success: '' });
    };

    const handleURLChange = e => {
        setState({ ...state, url: e.target.value, error: '', success: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`${API}/link`, { title, url, categories, type, medium }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setState({ ...state, title: '', url: '', success: `${response.data.title} is created`, error: '', loadedCategories: [], categories: [], type: '', medium: '' });
        } catch (error) {
            setState({ ...state, error: error.response?.data.error || 'An error occurred. Please try again.' });
        }
    };

    const handleTypeClick = e => {
        setState({ ...state, type: e.target.value, success: '', error: '' });
    };

    const handleMediumClick = e => {
        setState({ ...state, medium: e.target.value, success: '', error: '' });
    };

    const handleToggle = c => () => {
        const clickedCategory = categories.indexOf(c);
        const all = [...categories];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
        setState({ ...state, categories: all, success: '', error: '' });
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

    const submitLinkForm = () => (
        <form onSubmit={handleSubmit} className='form-container border-box'>
            <div className="form-group mb-3">
                <label>Title</label>
                <input
                    type="text"
                    className='form-control'
                    onChange={handleTitleChange}
                    value={title}
                    placeholder='Enter title'
                />
            </div>
            <div className="form-group mb-3">
                <label>URL</label>
                <input
                    type="url"
                    className='form-control'
                    onChange={handleURLChange}
                    value={url}
                    placeholder='Enter URL'
                />
            </div>
            <button disabled={!token} className="btn btn-primary" type="submit">
                {isAuth() || token ? 'Post' : 'Login to post'}
            </button>
        </form>
    );

    const showTypes = () => (
        <div className='form-section border-box'>
            <label>Type</label>
            <div className='form-check'>
                <input type="radio" onClick={handleTypeClick} checked={type === 'free'} value="free" className='form-check-input' name="type" />
                <label className='form-check-label ml-2'>Free</label>
            </div>
            <div className='form-check'>
                <input type="radio" onClick={handleTypeClick} checked={type === 'paid'} value="paid" className='form-check-input' name="type" />
                <label className='form-check-label ml-2'>Paid</label>
            </div>
        </div>
    );

    const showMedium = () => (
        <div className='form-section border-box'>
            <label>Medium</label>
            <div className='form-check'>
                <input type="radio" onClick={handleMediumClick} checked={medium === 'video'} value="video" className='form-check-input' name="medium" />
                <label className='form-check-label ml-2'>Video</label>
            </div>
            <div className='form-check'>
                <input type="radio" onClick={handleMediumClick} checked={medium === 'book'} value="book" className='form-check-input' name="medium" />
                <label className='form-check-label ml-2'>Book</label>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="container mt-2">
                <div className="row mb-4 text-white">
                <div className="col-md-12 text-white">
                    <h1 className="text-white" style={{ color: 'white' }}>Submit Link/URL</h1>
                </div>

                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-section border-box">
                            <label className='text-dark'>Category</label>
                            {showCategories()}
                        </div>
                        <div className="form-section border-box">
                            {showTypes()}
                        </div>
                        <div className="form-section border-box">
                            {showMedium()}
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="form-section border-box">
                            {success && showSuccessMessage(success)}
                            {error && showErrorMessage(error)}
                            {submitLinkForm()}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
    .form-container {
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-section {
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        background: white;
        margin-bottom: 1rem;
    }

    .border-box {
        border: 1px solid #ddd;
        padding: 1rem;
        border-radius: 0.5rem;
        background: white;
    }

    .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
    
    .category-item {
        display: flex;
        align-items: center;
        padding: 10px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
    }

    .category-item input {
        margin-right: 10px;
        cursor: pointer;
    }

    .category-item label {
        cursor: pointer;
    }
`}</style>
        </Layout>
    );
};

Create.getInitialProps = ({ req }) => {
    const token = getCookie('token', req);
    return { token };
};

export default withUser(Create);
