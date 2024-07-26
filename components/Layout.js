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
        <ul className="nav nav-tabs bg-warning">
            <li className="nav-item">
                <Link href="/" legacyBehavior>
                    <a className="nav-link text-dark">Home</a>
                </Link>
            </li>

            <li className="nav-item">
                <Link href="/user/link/create" legacyBehavior>
                    <a className="nav-link text-dark btn btn-success" style={{ borderRadius: '0px' }}>
                        Submit a link
                    </a>
                </Link>
            </li>

            {!auth && (
                <>
                    <li className="nav-item">
                        <Link href="/login" legacyBehavior>
                            <a className="nav-link text-dark">Login</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/register" legacyBehavior>
                            <a className="nav-link text-dark">Register</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/guestlogin" legacyBehavior>
                            <a className="nav-link text-dark">Guest Login</a>
                        </Link>
                    </li>
                </>
            )}

            {auth && auth.role === 'admin' && (
                <li className="nav-item ml-auto">
                    <Link href="/admin" legacyBehavior>
                        <a className="nav-link text-dark">{auth.name}</a>
                    </Link>
                </li>
            )}

            {auth && auth.role === 'subscriber'  && (
                <li className="nav-item ml-auto">
                    <Link href="/user" legacyBehavior>
                        <a className="nav-link text-dark">{auth.name}</a>
                    </Link>
                </li>
            )}

            {auth && (
                <li className="nav-item">
                    <a onClick={logout} className="nav-link text-dark">
                        Logout
                    </a>
                </li>
            )}
        </ul>
    );

    return (
        <>
            <Head>{head()}</Head>
            {nav()}
            <div className="container pt-5 pb-5">{children}</div>
        </>
    );
};

export default Layout;
