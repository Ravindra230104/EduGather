import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import dynamic from 'next/dynamic';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Update = ({ oldCategory, token }) => {
    const [state, setState] = useState({
        name: oldCategory ? oldCategory.category.name : '',
        error: '',
        success: '',
        buttonText: 'Update',
        imagePreview: oldCategory && oldCategory.category.image ? oldCategory.category.image.url : '',
        image: ''
    });
    

    const [content, setContent] = useState(oldCategory ? oldCategory.category.content : '');
    const [imageUploadButtonName, setImageUploadButtonName] = useState('Update Image');
    const [loading, setLoading] = useState(!oldCategory); // Add loading state

    useEffect(() => {
        if (oldCategory) {
            setState({
                ...state,
                name: oldCategory.category.name,
                imagePreview: oldCategory.category.image ? oldCategory.category.image.url : '',
                image: ''
            });
            setContent(oldCategory.category.content);
            setLoading(false);
        }
    }, [oldCategory]);

    const { name, success, error, buttonText, imagePreview } = state;

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '' });
    };

    const handleContent = e => {
        setContent(e);
        setState({ ...state, success: '', error: '' });
    };

    const handleImage = event => {
        var fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        setImageUploadButtonName(event.target.files[0].name);
        if (fileInput) {
            try {
                Resizer.imageFileResizer(
                    event.target.files[0],
                    300,
                    300,
                    'JPEG',
                    100,
                    0,
                    uri => {
                        setState({ ...state, image: uri, success: '', error: '' });
                    },
                    'base64'
                );
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Updating' });

        try {
            const response = await axios.put(`${API}/category/${oldCategory.category.slug}`, { name, content, image: state.image }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setState({
                ...state,
                imagePreview: response.data.image.url,
                success: `${response.data.name} is updated`,
                buttonText: 'Update'
            });
            setContent(response.data.content);
        } catch (error) {
            console.error('Error updating category:', error);
            setState({
                ...state,
                buttonText: 'Update',
                error: error.response ? error.response.data.error : 'Something went wrong'
            });
        }
    };

    const updateCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange('name')}
                    value={name}
                    type="text"
                    className="form-control"
                    placeholder="Enter category name"
                    required
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                <ReactQuill
                    value={content}
                    onChange={handleContent}
                    placeholder="write content..."
                    theme="bubble"
                    className="pb-5 mb-3"
                    style={{ border: '1px solid white', backgroundColor: 'white' }}
                />
            </div>
            <div className="form-group">
                <label className="text-white">{imageUploadButtonName}{' '}</label>
                <span>
                    {imagePreview ? (
                        <img src={imagePreview} alt="image preview" height="20" />
                    ) : (
                        <p className="text-white">Choose New Image</p>
                    )}
                </span>
                <input
                    onChange={handleImage}
                    type="file"
                    className="form-control"
                />
            </div>
            <div className="form-group mt-3 mb-3">
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
                            <h1 className="text-center mb-4 text-white">Update Category</h1>
                            {loading && <p className="text-center text-white">Loading...</p>}
                            {!loading && success && showSuccessMessage(success)}
                            {!loading && error && showErrorMessage(error)}
                            {!loading && updateCategoryForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

Update.getInitialProps = async ({ req, query }) => {
    const token = req ? req.cookies.token : '';
    console.log('Token:', token);
    console.log('Query Slug:', query.slug);

    try {
        const response = await axios.post(`${API}/category/${query.slug}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('API Response:', response.data);

        return { oldCategory: response.data, token };
    } catch (error) {
        console.error('Error fetching category:', error.response ? error.response.data : error.message);

        return { oldCategory: null, token };
    }
};

export default withAdmin(Update);
