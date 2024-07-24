import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({ user }) => (
    <Layout>
        <h1 className="display-4 font-weight-bold mb-4">Admin Dashboard</h1>
        <div className="row">
            <div className="col-md-4 d-flex flex-column">
                <div className="list-group flex-fill">
                    <Link href="/admin/category/create" legacyBehavior>
                        <a className="list-group-item bg-success list-group-item-action">
                            Create Category
                        </a>
                    </Link>
                    <Link href="/admin/category/read" legacyBehavior>
                        <a className="list-group-item bg-primary list-group-item-action">
                            All Categories
                        </a>
                    </Link>
                    <Link href="/admin/link/read" legacyBehavior>
                        <a className="list-group-item bg-warning list-group-item-action">
                            All Links
                        </a>
                    </Link>
                    <Link href="/user/profile/update" legacyBehavior>
                        <a className="list-group-item bg-secondary list-group-item-action">
                            Update Profile
                        </a>
                    </Link>
                </div>
            </div>
             
        </div>
    </Layout>
);

export default withAdmin(Admin);
