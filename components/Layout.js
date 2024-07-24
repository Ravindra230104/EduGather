import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { isAuth, logout } from '../helpers/auth';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const Layout = ({ children }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        Router.events.on('routeChangeStart', () => NProgress.start());
        Router.events.on('routeChangeComplete', () => NProgress.done());
        Router.events.on('routeChangeError', () => NProgress.done());
        
        return () => {
            Router.events.off('routeChangeStart', () => NProgress.start());
            Router.events.off('routeChangeComplete', () => NProgress.done());
            Router.events.off('routeChangeError', () => NProgress.done());
        };
    }, []);

    const head = () => (
        <React.Fragment>
            <link 
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
                rel="stylesheet" 
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/static/css/styles.css" />
        </React.Fragment>
    );

    const nav = () => (
        <ul className="nav nav-tabs bg-warning">
            <li className="nav-item">
                <Link legacyBehavior href="/">
                    <a className="nav-link text-dark">Home</a>
                </Link>
            </li>

            <li className="nav-item">
                <Link legacyBehavior href="/user/link/create">
                    <a className="nav-link text-dark btn btn-success" style={{borderRadius:'0px'}}>Submit a link</a>
                </Link>
            </li>

            {!isAuth() && (
                <>
                    <li className="nav-item">
                        <Link legacyBehavior href="/login">
                            <a className="nav-link text-dark">Login</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link legacyBehavior href="/register">
                            <a className="nav-link text-dark">Register</a>
                        </Link>
                    </li>
                </>
            )}

            {isAuth() && (
                <div className="d-flex ms-auto">
                    <li className="nav-item">
                        <Link legacyBehavior href={isAuth().role === 'admin' ? "/admin" : "/user"}>
                            <a className="nav-link text-dark">{isAuth().name}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a onClick={logout} className="nav-link text-dark">Logout</a>
                    </li>
                </div>
            )}
        </ul>
    );

    return (
        <>
            <Head>
                {head()}
            </Head>
            {isClient && nav()}
            <div className="container pt-5 pb-5">
                {isClient ? children : 'Loading...'}
            </div>
        </>
    );
};

export default Layout;
