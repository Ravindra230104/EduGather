import Link from 'next/link';
import Image from 'next/image';
import { Container } from 'react-bootstrap';
import Counter from './Counter'; // Adjust the import path as needed

const HomePage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0 }}>
            {/* Navbar */}
            <div style={{ 
                background: 'linear-gradient(to right, #6441a5, #004e92)',   
                padding: '0.5rem 1rem', 
                flexShrink: 0 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" passHref legacyBehavior>
                        <a style={{ display: 'block' }}>
                            <Image
                                src="/static/images/img1.png"
                                alt="Logo"
                                width={60}
                                height={60}
                                style={{ display: 'block' }}
                            />
                        </a>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link href="/Home" passHref legacyBehavior>
                            <a style={{ color: '#fff', margin: '0 1rem', textDecoration: 'none' }}>Home</a>
                        </Link>
                        <Link href="/" passHref legacyBehavior>
                            <a style={{ color: '#fff', margin: '0 1rem', textDecoration: 'none' }}>About</a>
                        </Link>
                        <Link href="/" passHref legacyBehavior>
                            <a style={{ color: '#fff', margin: '0 1rem', textDecoration: 'none' }}>Contact</a>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div style={{ 
                display: 'flex', 
                flex: '1', 
                padding: '2rem', 
                overflow: 'auto',  
                paddingBottom: '10rem',
                background: 'linear-gradient(to right, #000428, #004e92)'
            }}>
                <div style={{ flex: '1', textAlign: 'center' }}>
                    <Image
                        src="/static/images/study.jpeg"
                        alt="Education"
                        width={600}
                        height={400}
                        style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                    />
                </div>

                <div style={{ flex: '1', paddingLeft: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'red', marginBottom: '1rem' }}>
                        Learn. Share. Grow.
                    </h1>
                    <p style={{ fontSize: '1rem' , color:'white'}}>
                        Welcome to EduGather, your go-to platform for sharing and learning educational content.
                        Whether you're preparing for interviews or want to sharpen your skills, we've got the resources for you.
                    </p>
                    <p style={{ fontSize: '1rem' , color:'white'}}>
                        EduGather offers categorized tutorials, online courses, and more to help you enhance your knowledge in programming, web development, and beyond.
                    </p>
                    <Link href="/Home" passHref legacyBehavior>
                        <a style={{ display: 'inline-block', padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '0.3rem', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none' }}>
                            Explore Now
                        </a>
                    </Link>

                    {/* Stats Section */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '2rem',
                        gap: '1rem',
                    }}>
                        <div style={{
                            flex: 1,
                            border: '2px solid #007bff',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            textAlign: 'center',
                            background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Links Uploaded</h2>
                            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#007bff' }}>
                                <Counter target={420} duration={2000} />
                            </div>
                        </div>
                        <div style={{
                            flex: 1,
                            border: '2px solid #007bff',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            textAlign: 'center',
                            background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Categories Present</h2>
                            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#007bff' }}>
                                <Counter target={45} duration={2000} />
                            </div>
                        </div>
                        <div style={{
                            flex: 1,
                            border: '2px solid #007bff',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            textAlign: 'center',
                           background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Users</h2>
                            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#007bff' }}>
                                <Counter target={2500} duration={2000} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                background: 'linear-gradient(to right, #6441a5, #004e92)',
                marginTop: 'auto',
                padding: '1rem 0'
            }}>
                <Container>
                    <div className="text-center" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50px'
                    }}>
                        <hr style={{ borderColor: '#495057', width: '80%', margin: '0 auto 0.5rem auto' }} />
                        <p style={{ marginBottom: '0', fontSize: '1rem', color: '#fff' }}>
                            © {new Date().getFullYear()} EduGather Inc. All Rights Reserved.
                        </p>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default HomePage;
