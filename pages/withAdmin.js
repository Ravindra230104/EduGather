import axios from 'axios';
import { API } from '../config';
import { getCookie } from '../helpers/auth';

const withAdmin = Page => {
    const WithAdminUser = props => <Page {...props} />;

    WithAdminUser.getInitialProps = async context => {
        const token = getCookie('token', context.req);
        console.log('withAdmin: Token:', token);

        let user = null;
        let userLinks = []
        if (token) {
            try {
                const response = await axios.get(`${API}/admin`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                user = response.data.user;
                userLinks = response.data.links
                console.log('withAdmin: User data retrieved:', user);
            } catch (error) {
                console.error('withAdmin: Error response data:', error.response?.data);
                console.error('withAdmin: Error response status:', error.response?.status);
                if (error.response && error.response.status === 401) {
                    user = null;
                    console.log('withAdmin: Unauthorized access, setting user to null');
                }
            }
        } else {
            console.log('withAdmin: No token found, setting user to null');
        }

        if (!user && context.res) {
            console.log('withAdmin: No user found, redirecting to home page');
            context.res.writeHead(302, { Location: '/' });
            context.res.end();
            return {};
        }

        const pageProps = Page.getInitialProps ? await Page.getInitialProps(context) : {};
        console.log('withAdmin: Page initial props:', pageProps);

        return {
            ...pageProps,
            user,
            token,
            userLinks
        };
    };

    return WithAdminUser;
};

export default withAdmin;
