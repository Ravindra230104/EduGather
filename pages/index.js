import Layout from '../components/Layout';
import axios from 'axios';
import { API } from '../config';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment from 'moment';

const Home = ({ categories }) => {
    const [popular, setPopular] = useState([]);

    useEffect(() => {
        loadPopular();
    }, []);

    const loadPopular = async () => {
        try {
            const response = await axios.get(`${API}/link/popular`);
            setPopular(response.data);
        } catch (err) {
            console.error('Error loading popular links:', err);
        }
    };

    const handleClick = async linkId => {
        try {
            await axios.put(`${API}/click-count`, { linkId });
            loadPopular();
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    const listOfLinks = () => (
        popular.map((l, i) => (
            <div key={i} className="row alert alert-primary mb-4 p-3 border rounded shadow-sm">
                <div className="col-md-8" onClick={() => handleClick(l._id)}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: 'red', textDecoration: 'none' }}>
                        <h5 className="pt-2 font-weight-bold" style={{ color: 'blue' }}>{l.title}</h5>
                        <h6 className="pt-2" style={{ fontSize: '14px' }}>{l.url}</h6>
                    </a>
                </div>
                <div className="col-md-4 pt-2">
                    <span className="text-muted">{moment(l.createdAt).fromNow()} by {l.postedBy.name}</span>
                    <br />
                    <span className="badge text-secondary pull-right">{l.clicks} clicks</span>
                </div>
                <div className="col-md-12 mt-2">
                    <span className="badge bg-light text-dark me-2">{l.type}</span>
                    <span className="badge bg-light text-dark me-2">{l.medium}</span>
                    {l.categories.map((c, i) => (
                        <span key={i} className="badge bg-success text-white me-2">{c.name}</span>
                    ))}
                </div>
            </div>
        ))
    );

    const listCategories = () => (
        categories.map((c, i) => (
            <Link href={`/links/${c.slug}`} key={i} legacyBehavior>
                <a className="bg-light p-3 col-md-4" style={{ border: '1px solid red', display: 'block' }}>
                    <div>
                        <div className='row'>
                            <div className='col-md-4'>
                                <img src={c.image && c.image.url} alt={c.name} style={{ width: '100px', height: 'auto' }} className='pr-3' />
                            </div>
                            <div className='col-md-8'>
                                <h3 style={{ margin: 0 }}>{c.name}</h3>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        ))
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-8">
                    <h1 className="font-weight-bold">Browse Tutorials/Courses</h1>
                    <br />
                </div>
            </div>
            <div className="row">
                {listCategories()}
            </div>
            <div className="row pt-5">
                <h2 className="font-weight-bold pb-3">Trending {popular.length}</h2>
                <div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
            </div>
        </Layout>
    );
};

Home.getInitialProps = async () => {
    try {
        const response = await axios.get(`${API}/categories`);
        return {
            categories: response.data
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            categories: []
        };
    }
};

export default Home;
