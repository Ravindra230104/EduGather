import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { API } from '../../../config';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

const Approval = ({ token }) => {
    const [unapprovedLinks, setUnapprovedLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch unapproved links on component mount
        const fetchUnapprovedLinks = async () => {
            try {
                const response = await axios.get(`${API}/links/unapproved`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUnapprovedLinks(response.data);
            } catch (error) {
                console.error('Error fetching unapproved links:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnapprovedLinks();
    }, [token]);

    const updateLinkState = (_id) => {
        setUnapprovedLinks(prevLinks => prevLinks.filter(link => link._id !== _id));
    };

    const handleApprove = async (_id) => {
        console.log(`Attempting to approve link with ID: ${_id}`);
        try {
            const response = await axios.put(`${API}/link/${_id}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`, // Ensure token is correctly passed
                },
            });
            console.log('Approve response:', response); // Log the response for debugging
    
            // Update state with the newly approved link removed
            updateLinkState(_id);
        } catch (error) {
            console.error('Error approving link:', error);
        }
    };
    
    const handleReject = async (_id) => {
        console.log(`Attempting to reject link with ID: ${_id}`); // Log ID
        try {
            const response = await axios.delete(`${API}/link/reject/${_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Reject response:', response); // Log the response

            // Update state with the rejected link removed
            updateLinkState(_id);
        } catch (error) {
            console.error('Error rejecting link:', error);
        }
    };

    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    return (
        <Layout>
            <h1 className="display-4 text-center text-white">Link Approval</h1>
            <ul className="list-group mb-4">
                {unapprovedLinks.length > 0 ? (
                    unapprovedLinks.map(link => (
                        <li key={link._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                {link.title} 
                                <div>
                                    <a href={link.url}> {link.url}</a>
                                </div>
                            </div>
                            <div>
                                <button 
                                    className="btn btn-success btn-sm mx-1"
                                    onClick={() => handleApprove(link._id)}>
                                    Approve
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm mx-1"
                                    onClick={() => handleReject(link._id)}>
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No unapproved links available.</li>
                )}
            </ul>
        </Layout>
    );
};

// Fetch the token for authorization
Approval.getInitialProps = async ({ req }) => {
    const token = getCookie('token', req);
    return { token };
};

export default withAdmin(Approval);
