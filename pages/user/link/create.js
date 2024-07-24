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

    const showTypes = () => (
        <div className='mb-3'>
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
        <div className='mb-3'>
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
        return loadedCategories && loadedCategories.map((c, i) => (
            <li className='list-unstyled mb-2' key={c._id}>
                <input type="checkbox" onChange={handleToggle(c._id)} className="form-check-input" style={{ marginRight: '10px' }} />
                <label className="form-check-label" style={{ marginLeft: '5px' }}>{c.name}</label>
            </li>
        ));
    };
 

    const submitLinkForm = () => (
        <form onSubmit={handleSubmit} className='p-4 border rounded bg-black text-white shadow-sm'>
            <div className="form-group mb-3">
                <label className="text-white">Title</label>
                <input
                    type="text"
                    className='form-control bg-dark text-white placeholder-white'
                    onChange={handleTitleChange}
                    value={title}
                    placeholder='Enter title'
                    style={{ 
                        '--placeholder-color': 'white', // Custom property for placeholder color
                    }}
                />
                <style jsx>{`
                    .form-control::placeholder {
                        color: var(--placeholder-color);
                    }
                `}</style>
            </div>
            <div className="form-group mb-3">
                <label className="text-white">URL</label>
                <input
                    type="url"
                    className='form-control bg-dark text-white placeholder-white'
                    onChange={handleURLChange}
                    value={url}
                    placeholder='Enter URL'
                    style={{ 
                        '--placeholder-color': 'white', // Custom property for placeholder color
                    }}
                />
                <style jsx>{`
                    .form-control::placeholder {
                        color: var(--placeholder-color);
                    }
                `}</style>
            </div>
            <button disabled={!token} className="btn btn-primary" type="submit">
                {isAuth() || token ? 'Post' : 'Login to post'}
            </button>
        </form>
    );
    
    
    
    return (
        <Layout>
            <div className="container mt-4">
                <div className="row mb-4">
                    <div className="col-md-12">
                        <h1 className="display-4" style={{fontWeight:'bold'}}>Submit Link/URL</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group mb-4">
                            <label className='text-muted'>Category</label>
                            <ul style={{ maxHeight: '150px', overflowY: 'scroll', paddingLeft: '0' }}>
                                {showCategories()}
                            </ul>
                        </div>
                        <div className="form-group mb-4">
                            <label className='text-muted'>Type</label>
                            {showTypes()}
                        </div>
                        <div className="form-group mb-4">
                            <label className='text-muted'>Medium</label>
                            {showMedium()}
                        </div>
                    </div>
                    <div className="col-md-8">
                        {success && showSuccessMessage(success)}
                        {error && showErrorMessage(error)}
                        {submitLinkForm()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

Create.getInitialProps = ({ req }) => {
    const token = getCookie('token', req);
    return { token };
};

export default withUser(Create);
