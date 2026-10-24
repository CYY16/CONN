import { Link } from 'react-router-dom';

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import ProductSalesChart from './ProductSalesChart';
import UserSalesChart from './UserSalesChart';
import MonthlySalesChart from './MonthlySalesChart';
import { useSelector } from 'react-redux'

const Dashboard = () => {
    const { loading, products } = useSelector(state => state.products)

    const outOfStock = products?.filter(product => product.stock === 0).length || 0;

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10 dashboard-content">
                    <h1 className="my-4">Dashboard</h1>

                    {loading ? <Loader /> : (
                        <>
                            <MetaData title={'Admin Dashboard'} />

                            <div className="row dashboard-statistics">
                                <div className="col-xl-6 col-sm-6 mb-3">
                                    <div className="card dashboard-stat-card h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Products<br /> <b>{products && products.length}</b></div>
                                        </div>

                                        <Link className="card-footer clearfix small z-1" to="/admin/products">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-6 mb-3">
                                    <div className="card dashboard-stat-card h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="row dashboard-charts">
                        <div className="col-12 col-xl-6 mb-4">
                            <section className="dashboard-chart-card">
                                <h2>Product Sales</h2>
                                <div className="dashboard-chart">
                                    <ProductSalesChart />
                                </div>
                            </section>
                        </div>
                        <div className="col-12 col-xl-6 mb-4">
                            <section className="dashboard-chart-card">
                                <h2>Customer Sales</h2>
                                <div className="dashboard-chart">
                                    <UserSalesChart />
                                </div>
                            </section>
                        </div>
                        <div className="col-12 mb-4">
                            <section className="dashboard-chart-card">
                                <h2>Monthly Sales</h2>
                                <div className="dashboard-chart dashboard-chart-wide">
                                    <MonthlySalesChart />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
