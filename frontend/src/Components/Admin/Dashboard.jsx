import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import ProductSalesChart from './ProductSalesChart';
import UserSalesChart from './UserSalesChart';
import MonthlySalesChart from './MonthlySalesChart';
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts } from '../../actions/productActions'

const Dashboard = () => {
    const dispatch = useDispatch();
    const { loading, products } = useSelector(state => state.products)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        dispatch(getAdminProducts())
    }, [dispatch])

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
                    <div className="row mb-3">
                        <div className="col-12 col-sm-6 col-md-3 form-group">
                            <label htmlFor="start_date_field">Start Date</label>
                            <input
                                type="date"
                                id="start_date_field"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-md-3 form-group">
                            <label htmlFor="end_date_field">End Date</label>
                            <input
                                type="date"
                                id="end_date_field"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row dashboard-charts">
                        <div className="col-12 col-xl-6 mb-4">
                            <section className="dashboard-chart-card">
                                <h2>Product Sales</h2>
                                <div className="dashboard-chart">
                                    <ProductSalesChart startDate={startDate} endDate={endDate} />
                                </div>
                            </section>
                        </div>
                        <div className="col-12 col-xl-6 mb-4">
                            <section className="dashboard-chart-card">
                                <h2>Customer Sales</h2>
                                <div className="dashboard-chart">
                                    <UserSalesChart startDate={startDate} endDate={endDate} />
                                </div>
                            </section>
                        </div>
                        <div className="col-12 mb-4">
                            <section className="dashboard-chart-card">
                                <h2>Monthly Sales</h2>
                                <div className="dashboard-chart dashboard-chart-wide">
                                    <MonthlySalesChart startDate={startDate} endDate={endDate} />
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
