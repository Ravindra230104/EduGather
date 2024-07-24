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
            <div key={i} className="row alert alert-secondary mb-4 p-3 border rounded shadow-sm">
                <div className="col-md-8" onClick={() => handlePopularClick(l._id)}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: 'red', textDecoration: 'none' }}>
                        <h5 className="pt-2 font-weight-bold" style={{ color: 'blue' }}>{l.title}</h5>
                        <h6 className="pt-2" style={{ fontSize: '14px' }}>{l.url}</h6>
                    </a>
                </div>
                <div className="col-md-4 pt-2">
                    <span className="text-black">{moment(l.createdAt).fromNow()} by {l.postedBy.name}</span>
                    <br />
                    <span className="badge text-black pull-right">{l.clicks} clicks</span>
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

    const listOfLinks = () => (
        allLinks.map((l, i) => (
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
                        <h1 className="display-4 font-weight-bold mb-3">{category.name} - URL/Links</h1>
                        <div className="lead alert alert-secondary pt-4">{renderHTML(category.content || '')}</div>
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
                        <h2 className='lead'>Most Popular in {category.name}</h2>
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
