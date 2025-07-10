import Layout from '../../components/Layout';
import withUser from '../withUser';
import Link from 'next/link';
import axios from 'axios';
import { API } from '../../config';
import moment from 'moment';
import Router from 'next/router'

const User = ({ user, userLinks, token }) => {

    const confirmDelete = (e, id) => {
        e.preventDefault();
        let answer = window.confirm('Are you sure you want to delete?');
        if (answer) {
            handleDelete(id);
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API}/link/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Router.replace('/user');
        } catch (error) {
            console.log('link delete error', error);
        }
    }

    const handleClick = async linkId => {
        try {
            await axios.put(`${API}/click-count`, { linkId });
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    const listOfLinks = () => (
        userLinks.map((l, i) => (
            <div key={i} className="row mb-4 p-3 border rounded shadow-sm" style={{ background: 'linear-gradient(to right, #360033, #0b8793)' }}>
                <div className="col-md-8" onClick={() => handleClick(l._id)}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <h5 className="pt-2 font-weight-bold text-primary">{l.title}</h5>
                        <p className="text-white small">{l.url}</p>
                    </a>
                </div>
                <div className="col-md-4 text-end">
                    <span className="text-white small">{moment(l.createdAt).fromNow()} by {l.postedBy.name}</span>
                    <br />
                    <span className="badge bg-info text-dark">{l.clicks} clicks</span>
                </div>
                <div className="d-flex align-items-center mt-2">
                    <span className="badge bg-secondary" style={{ marginRight: '10px' }}>{l.type}</span>
                    <span className="badge bg-secondary" style={{ marginRight: '10px' }}>{l.medium}</span>
                    {l.categories.map((c, i) => (
                        <span key={i} className="badge bg-success" style={{ marginRight: '10px' }}>{c.name}</span>
                    ))}
                    <Link legacyBehavior href={`/user/link/${l.slug}`}>
                        <span onClick={(e) => confirmDelete(e, l._id)} className='badge bg-danger' style={{ cursor: 'pointer', marginRight: '10px' }}>Delete</span>
                    </Link>
                    <Link legacyBehavior href={`/user/link/${l.slug}`}>
                        <span className='badge bg-warning text-dark' style={{ cursor: 'pointer' }}>Update</span>
                    </Link>
                </div>


            </div>
        ))
    );
    

    return (
        <Layout>
            <div className="container">
                <h1 className="text-white text-center mb-4">
                    {user.name}'s Dashboard
                    <span className='text-danger'> ({user.role})</span>
                </h1>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Actions</h5>
                                <hr />
                                <Link legacyBehavior href="/user/link/create">
                                    <a className="btn btn-outline-primary w-100 mb-3" style={{ backgroundColor: 'green', color: 'white' }}>Submit a Link</a>
                                </Link>
                                <Link legacyBehavior href="/user/profile/update">
                                    <a className="btn btn-outline-warning w-100" style={{ backgroundColor: 'green', color: 'white' }}>Update Profile</a>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card shadow-lg p-4">
                            <h2 className="text-dark">Your Links</h2>
                            <hr />
                            {userLinks.length > 0 ? (
                                listOfLinks()
                            ) : (
                                <p className="text-muted">No links found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default withUser(User);
