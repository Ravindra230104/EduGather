import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, logout } from '../helpers/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useState, useEffect } from 'react';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const Layout = ({ children }) => {

    const [auth, setAuth] = useState(null);

    useEffect(() => {
        setAuth(isAuth());
    }, []);


    const head = () => (
        <>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/static/css/styles.css" />
        </>
    );

    const nav = () => (
        <ul className="nav nav-tabs" style={{ background: 'linear-gradient(to right, #4b79a1, #283e51)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <li className="nav-item">
            <Link href="/" legacyBehavior>
                <a className="nav-link text-white">Home</a>
            </Link>
        </li>


        <div className="d-flex ml-auto">

            {auth && auth.role === 'subscriber' && (
                    <li className="nav-item">
                        <Link href="/user/chat" legacyBehavior>
                            <a className="nav-link text-white">Discussions</a>
                        </Link>
                    </li>
            )}

            <li className="nav-item">
                <Link href="/user/link/create" legacyBehavior>
                    <a className="nav-link btn " style={{ color: 'white', borderRadius: '0px' }}>
                        Submit a link
                    </a>
                </Link>
            </li>

            {!auth && (
                <>
                    <li className="nav-item">
                        <Link href="/login" legacyBehavior>
                            <a className="nav-link text-white">Login</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/register" legacyBehavior>
                            <a className="nav-link text-white">Register</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/guestlogin" legacyBehavior>
                            <a className="nav-link text-white">Guest Login</a>
                        </Link>
                    </li>
                </>
            )}

            {auth && auth.role === 'admin' && (
                <li className="nav-item">
                    <Link href="/admin" legacyBehavior>
                        <a className="nav-link text-white">{auth.name}</a>
                    </Link>
                </li>
            )}

            {auth && auth.role === 'subscriber' && (
                <li className="nav-item">
                    <Link href="/user" legacyBehavior>
                        <a className="nav-link text-white">{auth.name}</a>
                    </Link>
                </li>
            )}

            {auth && (
                <li className="nav-item">
                    <a onClick={logout} className="nav-link text-white">
                        Logout
                    </a>
                </li>
            )}
        </div>
    </ul>
    );

    return (
        <>
            <Head>{head()}</Head>
            <div style={{ 
                // background: 'linear-gradient(to right, #20002c, ##cbb4d4)',   
                background: 'linear-gradient(to right,  #000428, #004e92)',
                minHeight: '100vh',  // Ensures the gradient covers the full viewport
                display: 'flex',
                flexDirection: 'column'
            }}>
                {nav()}
                <div className="container pt-5 pb-5" style={{ 
                    //  background: 'linear-gradient(to right,  #159957, #155799)',    
                }}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Layout;