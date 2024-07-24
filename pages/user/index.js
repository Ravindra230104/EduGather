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
        let answer = window.confirm('Are you sure you want to delete?')
        if(answer){
            handleDelete(id);
        }
    }

    const handleDelete = async (id) => {
        console.log('delete link')
        try{
            const response = await axios.delete(`${API}/link/${id}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('Link deleted success',response)
            Router.replace('/user')
        }catch(error){
            console.log('link delete error',error)
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
                   <Link legacyBehavior href={`/user/link/${l.slug}`}>
                        <span onClick={(e) => confirmDelete(e, l._id)} className='badge bg-danger text-white me-2'>Delete</span>
                    </Link>
                    <Link legacyBehavior href={`/user/link/${l.slug}`}>
                        <span className='badge bg-warning text-dark me-2'>Update</span>
                    </Link> 
                </div>
            </div>
        ))
    );


    return (
        <Layout>
            <h1>
                {user.name}'s dashboard
                <span className='text-danger'>/{user.role}</span>
            </h1>
            <hr />
            <div className="row">
                <div className="col-md-4">
                    <ul className="nav flex-column">
                       <li className="nav-item">
                           <Link legacyBehavior href="/user/link/create">
                               <a className="nav-link bg-success text-white text-decoration-none w-75">Submit a link</a>
                           </Link>
                       </li>
                       <li className="nav-item">
                           <Link legacyBehavior href="/user/profile/update">
                               <a className="nav-link bg-warning text-white text-decoration-none w-75">Update profile</a>
                           </Link>
                       </li>
                   </ul>

                </div>
                <div className="col-md-8">
                    <h2>Your Links</h2>
                    <br/>
                    {listOfLinks()}
                </div>
            </div>
        </Layout>
    );
}

export default withUser(User);
