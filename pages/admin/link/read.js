import { useState } from 'react';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API } from '../../../config';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

const Links = ({ token, links, totalLinks, linksLimit, linkSkip }) => {
    const [allLinks, setAllLinks] = useState(links);
    const [limit, setLimit] = useState(linksLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalLinks);


    const confirmDelete = (e, id) => {
        e.preventDefault();
        let answer = window.confirm('Are you sure you want to delete?')
        if(answer){
            handleDelete(id);
        }
    }

    const handleDelete = async (id) => {
        console.log('delete link')
        try{
            const response = await axios.delete(`${API}/link/admin/${id}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('Link deleted success',response)
            process.browser && window.location.reload()
        }catch(error){
            console.log('link delete error',error)
        }
    }

    const handleClick = async linkId => {
        try {
            await axios.put(`${API}/click-count`, { linkId });
            process.browser && window.location.reload()
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    const listOfLinks = () =>
        allLinks.map((l, i) => (
            <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8" onClick={() => handleClick(l._id)}>
                    <a href={l.url} target="_blank" style={{textDecoration: 'none'}}>
                        <h5 className="pt-2">{l.title}</h5>
                        <h6 className="pt-2 text-danger" style={{ fontSize: '14px' }}>
                            {l.url}
                        </h6>
                    </a>
                </div>
                <div className="col-md-4 pt-2">
                    <span className="pull-right">
                        {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                    </span>
                    <br />
                    <span className="badge text-secondary pull-right">{l.clicks} clicks</span>
                </div>
                <div className="col-md-12">
                    <span className="badge bg-light text-dark me-2">
                        {l.type}
                    </span>
                    <span className="badge bg-light text-dark me-2">
                          {l.medium}
                    </span>
                    {l.categories.map((c, i) => (
                        <span key={i} className="badge bg-success text-white me-2">
                            {c.name}
                        </span>
                    ))}
                    <Link legacyBehavior href={`/user/link/${l.slug}`}>
                        <span onClick={(e) => confirmDelete(e, l._id)} className='badge bg-danger text-white me-2'>Delete</span>
                    </Link>
                    <Link legacyBehavior href={`/user/link/${l.slug}`}>
                        <span className='badge bg-warning text-dark me-2'>Update</span>
                    </Link> 
                </div>
            </div>
        ));

        const loadMore = async () => {
            let toSkip = skip + limit;
        
            try {
                const response = await axios.post(
                    `${API}/links`,
                    { skip, limit },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
        
                // Ensure no duplicates
                const newLinks = response.data;
                const existingIds = new Set(allLinks.map(link => link._id));
                const uniqueNewLinks = newLinks.filter(link => !existingIds.has(link._id));
        
                setAllLinks([...allLinks, ...uniqueNewLinks]);
                setSize(response.data.length);
                setSkip(toSkip);
            } catch (error) {
                console.error('Error loading more links:', error);
            }
        };
        

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1 className="display-4 font-weight-bold">All Links</h1>
                </div>
            </div>
            <hr />

            <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={size > 0 && size >= limit}
                loader={<img key={0} src="/static/images/loading.gif" alt="loading" />}
            >
                <div className="row">
                    <div className="col-md-12">{listOfLinks()}</div>
                </div>
            </InfiniteScroll>
        </Layout>
    );
};

Links.getInitialProps = async ({ req }) => {
    let skip = 0;
    let limit = 2;

    const token = getCookie('token', req);

    const response = await axios.post(
        `${API}/links`,
        { skip, limit },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return {
        links: response.data,
        totalLinks: response.data.length,
        linksLimit: limit,
        linkSkip: skip,
        token
    };
};

export default withAdmin(Links);
