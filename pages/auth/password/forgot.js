import { withRouter } from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import Layout from '../../../components/Layout';
import { useState } from 'react';

const ForgotPassword = () => {
    const [state, setState] = useState({
        email: '',
        buttonText: 'Forgot Password',
        success: '',
        error: ''
    });
    const { email, buttonText, success, error } = state;

    const handleChange = e => {
        setState({ ...state, email: e.target.value,success:'',error:''});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        console.log('post email to', email);

        try {
            const response = await axios.put(`${API}/forgot-password`, { email });
            setState({
                ...state,
                email: '',
                buttonText: 'Done',
                success: response.data.message
            });
        } catch (error) {
            setState({
                ...state,
                buttonText: 'Forgot Password',
                error: error.response.data.error
            });
        }
    };

    const passwordForgotForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <input type="email" className="form-control" onChange={handleChange} value={email} placeholder="Enter your Email" required />
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
                            <h1 className="text-center mb-4 text-white">Forgot Password</h1>
                            {success && showSuccessMessage(success)}
                            {error && showErrorMessage(error)}
                            {passwordForgotForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
