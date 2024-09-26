import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({ user }) => {
    // Dummy data
    const totalCategories = 35;
    const totalLinks = 300;
    const totalUsers = 2500;
    const recentActivities = [
        { action: 'Created category "JavaScript Basics"', date: '2024-09-15' },
        { action: 'Added link "React Documentation"', date: '2024-09-14' },
        { action: 'Updated profile of user "Ravindra Sapkal"', date: '2024-09-13' },
    ];

    return (
        <Layout>
            <h1 className="display-4 font-weight-bold mb-4 text-center text-white">Admin Dashboard</h1>

            <div className="row">
                {/* Left Sidebar */}
                <div className="col-md-4">
                    <div className="list-group mb-4 sidebar">
                        <Link href="/admin/category/create" legacyBehavior>
                            <span className="list-group-item link-item">Create Category</span>
                        </Link>
                        <Link href="/admin/category/read" legacyBehavior>
                            <span className="list-group-item link-item">All Categories</span>
                        </Link>
                        <Link href="/admin/link/read" legacyBehavior>
                            <span className="list-group-item link-item">All Links</span>
                        </Link>
                        <Link href="/user/profile/update" legacyBehavior>
                            <span className="list-group-item link-item">Update Profile</span>
                        </Link>
                        <Link href="/admin/link/approval" legacyBehavior>
                            <span className="list-group-item link-item">Link Approval</span>
                        </Link>
                    </div>
                </div>

                {/* Right Content */}
                <div className="col-md-8">
                    <div className="row mb-4 justify-content-center">
                        <div className="col-md-4">
                            <div className="card stat-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Total Categories</h5>
                                    <p className="card-text text-white">{totalCategories}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card stat-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Total Links</h5>
                                    <p className="card-text text-white">{totalLinks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card stat-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Total Users</h5>
                                    <p className="card-text text-white">{totalUsers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h4 className="mb-4 text-white">Recent Activities</h4>
                    <div className="recent-activities">
                        <ul className="list-group mb-4 activity-list">
                            {recentActivities.map((activity, index) => (
                                <li key={index} className="list-group-item activity-item">
                                    {activity.action} <span className="text-error">({activity.date})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .sidebar {
                    background-color: #2c3e50;
                    border-radius: 8px;
                }
                .link-item {
                    color: white;
                    background-color: #34495e;
                    border: none;
                    border-radius: 8px;
                    padding: 15px;
                    transition: background-color 0.3s;
                }
                .link-item:hover {
                    background-color: #1abc9c;
                }
                .stat-card {
                    border: 1px solid #bdc3c7;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    background-color: #7695FF;
                    height: 200px;
                }
                .card-title {
                    font-size: 1.5rem;
                    margin-bottom: 0;
                }
                .card-text {
                    font-size: 2rem;
                    color: #2980b9;
                }
                .recent-activities {
                    border-radius: 8px;
                    padding: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    background-color: #7695FF;
                }
                .activity-list {
                    margin: 0;
                }
                .activity-item {
                    border: none;
                    background-color: transparent;
                    padding: 10px;
                    transition: background-color 0.3s;
                }
                .activity-item:hover {
                    background-color: #e7e9ec;
                }
            `}</style>
        </Layout>
    );
};

export default withAdmin(Admin);
