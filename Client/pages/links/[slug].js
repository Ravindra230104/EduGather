import { useState, useEffect, Fragment} from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { API} from '../../config';
import {APP_NAME} from '../../next.config'
import { showErrorMessage } from '../../helpers/alerts';
import renderHTML from 'react-render-html';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import Head from 'next/head'
import Link from 'next/link';

const Links = ({ query, category, links, totalLinks, linksLimit, linkSkip }) => {
    const [allLinks, setAllLinks] = useState(links);
    const [limit, setLimit] = useState(linksLimit);
    const [skip, setSkip] = useState(linkSkip);
    const [size, setSize] = useState(totalLinks);
    const [popular, setPopular] = useState([]);

    const stripHtml = data => data.replace(/<\/?[^>]*(>|$)/g, '');;

    const head = () => {
        <Head>
            <title>{category.name} | {APP_NAME}</title>
            <meta name="description" content={stripHtml(category.content.substring(0,160))}/>
            <meta property="og:title" content={category.name}/>
            <meta property="og:description" content={stripHtml(category.content.substring(0,160))}/>
            <meta property="og:image" content={category.image.url}/>
            <meta property="og:image:secure_url" content={category.image.url}/>
        </Head>
    }

    useEffect(() => {
        loadPopular();
    }, []);

    const loadPopular = async () => {
        try {
            const response = await axios.get(`${API}/link/popular/${category.slug}`);
            setPopular(response.data);
        } catch (err) {
            console.error('Error loading popular links:', err);
        }
    };

    useEffect(() => {
        setAllLinks(links);
        setSkip(linkSkip);
        setLimit(linksLimit);
        setSize(totalLinks);
    }, [links, linkSkip, linksLimit, totalLinks]);

    const handleClick = async linkId => {
        try {
            await axios.put(`${API}/click-count`, { linkId });
            process.browser && window.location.reload()
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    const handlePopularClick = async linkId => {
        try {
            await axios.put(`${API}/click-count`, { linkId });
            loadPopular();
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    const loadUpdatedLinks = async () => {
        try {
            const response = await axios.post(`${API}/category/${query.slug}`, { skip, limit });
            setAllLinks(response.data.links);
        } catch (error) {
            console.error('Error loading updated links:', error);
            showErrorMessage('Error loading updated links');
        }
    };

    const listOfPopularLinks = () => (
        popular.map((l, i) => (
            <div key={i} className="row mb-4 p-3 border rounded shadow-sm" style={{ background: 'linear-gradient(to right, #360033, #0b8793)' }}>
                <div className="col-md-8 d-flex flex-column" onClick={() => handlePopularClick(l._id)}>
                    <h5 className="pt-2 font-weight-bold text-warning">{l.title}</h5>
                    <button 
                        className="btn btn-light btn-sm mt-2" 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the onClick of the parent div
                            window.open(l.url, '_blank', 'noopener noreferrer');
                        }}
                        style={{ color: 'blue', textDecoration: 'none' }}
                    >
                        Read Here
                    </button>
                </div>
                <div className="col-md-4 text-end d-flex flex-column justify-content-between">
                    <div>
                        <span className="text-white small">{moment(l.createdAt).fromNow()}</span>
                        <br />
                        <span className="badge bg-info text-dark">{l.clicks} clicks</span>
                    </div>
                    <div className="d-flex align-items-center mt-2">
                        <span className="badge bg-primary me-2" style={{ marginRight: '10px' }}>{l.type}</span>
                        <span className="badge bg-white me-2">{l.medium}</span>
                        {l.categories.map((c, i) => (
                            <span key={i} className="badge bg-success me-2">{c.name}</span>
                        ))}
                    </div>
                </div>
            </div>
        ))
    );
    
    
    

    const listOfLinks = () =>
        allLinks.map((l, i) => (
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
        ));

    const loadMore = async () => {
        let toSkip = skip + limit;
        try {
            const response = await axios.post(`${API}/category/${query.slug}`, { skip: toSkip, limit });
            setAllLinks([...allLinks, ...response.data.links]);
            setSize(response.data.links.length);
            setSkip(toSkip);
        } catch (error) {
            console.error('Error loading more links:', error);
            showErrorMessage('Error loading more links');
        }
    };

    return (
        <Fragment>
            {head()}
            <Layout>
            <style jsx>{`
                a {
                    text-decoration: none;
                }
                a:hover h5, a:hover h6 {
                    text-decoration: underline;
                }
            `}</style>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-8">
                        <h1 className="display-4 font-weight-bold mb-3 text-white">{category.name} - URL/Links</h1>
                        <div className="lead alert alert-secondary pt-4 text-error">{renderHTML(category.content || '')}</div>
                    </div>
                    <div className="col-md-4">
                        <img
                            src={category.image ? category.image.url : '/default-image.jpg'}
                            alt={category.name}
                            className="img-fluid rounded"
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-8">
                        {listOfLinks()}
                    </div>
                    <div className="col-md-4">
                        <h2 className='lead text-white'>Most Popular in {category.name}</h2>
                        <div className="p-3">
                            <p>{listOfPopularLinks()}</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 text-center">
                        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={true} loader={<div className="loader" key={0}></div>}>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
            </Layout>
        </Fragment>
    );
};

Links.getInitialProps = async ({ query }) => {
    let skip = 0;
    let limit = 2;

    try {
        const response = await axios.post(`${API}/category/${query.slug}`, { skip, limit });
        return {
            query,
            category: response.data.category || {},
            links: response.data.links || [],
            totalLinks: response.data.totalLinks || 0,
            linksLimit: limit,
            linkSkip: skip
        };
    } catch (error) {
        console.error('Error fetching initial data:', error);
        return {
            query,
            category: {},
            links: [],
            totalLinks: 0,
            linksLimit: limit,
            linkSkip: skip
        };
    }
};

export default Links;
