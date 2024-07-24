import Router, { withRouter } from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../../helpers/alerts';
import { API } from '../../../../config';
import Layout from '../../../../components/Layout';
import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

const ResetPassword = ({ router }) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset Password',
        success: '',
        error: ''
    });
    const { name, token, newPassword, buttonText, success, error } = state;

    useEffect(() => {
        const decoded = jwt.decode(router.query.id);
        if (decoded) {
            setState(prevState => ({ ...prevState, name: decoded.name, token: router.query.id }));
        }
    }, [router.query.id]);

    const handleChange = e => {
        setState({ ...state, newPassword: e.target.value, success: '', error: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Sending' });
        try {
            const response = await axios.put(`${API}/reset-password`, { resetPasswordLink: token, newPassword });
            setState({
                ...state,
                newPassword: '',
                buttonText: 'Done',
                success: response.data.message
            });
        } catch (error) {
            setState({
                ...state,
                buttonText: 'Reset Password',
                error: error.response.data.error
            });
        }
    };

    const passwordResetForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <input type="password" className="form-control" onChange={handleChange} value={newPassword} placeholder="Enter new password" required />
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
                            <h2 className="text-center mb-4 text-white">Hi {name}, Ready to reset your password?</h2>
                            {success && showSuccessMessage(success)}
                            {error && showErrorMessage(error)}
                            {passwordResetForm()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(ResetPassword);
