import { useState } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import dynamic from 'next/dynamic';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Create = ({ user, token }) => {
    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        buttonText: 'Create',
        image: ''
    });

    const [content, setContent] = useState('');
    const [imageUploadButtonName, setImageUploadButtonName] = useState('Upload Image');

    const { name, success, error, buttonText, image } = state;

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '' });
    };

    const handleContent = e => {
        setContent(e);
        setState({ ...state, success: '', error: '' });
    };

    const handleImage = event => {
        if (event.target.files[0]) {
            setImageUploadButtonName(event.target.files[0].name);
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
                    'base64',
                    200,
                    200
                );
            } catch (err) {
                console.log('Image Resizer Error:', err);
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API}/category`, { name, content, image }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('API Response:', response.data); // Log API Response

            setState(prevState => ({
                ...prevState,
                name: '',
                buttonText: 'Create',
                success: `${response.data.name} is created`,
                error: '',
                image: ''
            }));
            console.log('State after success:', {
                name: '',
                buttonText: 'Create',
                success: `${response.data.name} is created`,
                error: '',
                image: ''
            }); // Log State After Success
        } catch (error) {
            console.error('Error creating category:', error);
            setState(prevState => ({
                ...prevState,
                buttonText: 'Create',
                error: error.response ? error.response.data.error : 'Something went wrong'
            }));
            console.log('State after error:', {
                buttonText: 'Create',
                error: error.response ? error.response.data.error : 'Something went wrong'
            }); // Log State After Error
        }
    };

    const createCategoryForm = () => (
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
                    placeholder="Write content..."
                    theme="bubble"
                    className="pb-5 mb-3"
                    style={{ border: '1px solid white', backgroundColor: 'white' }}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">{imageUploadButtonName}</label>
                <input
                    onChange={handleImage}
                    type="file"
                    className="form-control"
                    required
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
                            <h1 className="text-center mb-4 text-white">Create Category</h1>
                            {success && showSuccessMessage(success)}
                            {error && showErrorMessage(error)}
                            {createCategoryForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default withAdmin(Create);
