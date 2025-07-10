import axios from 'axios';
import { API } from '../config';
import { getCookie } from '../helpers/auth';

const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />;

    WithAuthUser.getInitialProps = async context => {
        const token = getCookie('token', context.req);
        console.log('withUser: Token:', token);
        
        let user = null;
        let userLinks = []

        if (token) {
            try {
                const response = await axios.get(`${API}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('response in withUser',response)
                user = response.data.user;
                userLinks = response.data.links
                console.log('withUser: User data retrieved:', user);
            } catch (error) {
                console.error('withUser: Error response data:', error.response?.data);
                console.error('withUser: Error response status:', error.response?.status);
                if (error.response && error.response.status === 401) {
                    user = null;
                    console.log('withUser: Unauthorized access, setting user to null');
                }
            }
        } else {
            console.log('withUser: No token found, setting user to null');
        }

        // If user is not authenticated and we're on the server side, redirect to the home page
        if (!user && context.res) {
            console.log('withUser: No user found, redirecting to home page');
            context.res.writeHead(302, {
                Location: '/',
            });
            context.res.end();
            return {};
        }

        // Return props for the page, including user and token if available
        const pageProps = Page.getInitialProps ? await Page.getInitialProps(context) : {};
        console.log('withUser: Page initial props:', pageProps);

        return {
            ...pageProps,
            user,
            token,
            userLinks
        };
    };

    return WithAuthUser;
};

export default withUser;
