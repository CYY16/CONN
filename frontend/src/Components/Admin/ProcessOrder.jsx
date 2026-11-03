import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios'
// import { getToken } from '../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, updateOrder, clearErrors } from '../../actions/orderActions'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'

const ProcessOrder = () => {
    const dispatch = useDispatch();
    const { loading, error: orderError, order = {} } = useSelector(state => state.orderDetails)

    const { error, isUpdated } = useSelector(state => state.order)

    const [status, setStatus] = useState('')
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState('')
    // const [order, setOrder] = useState({})
    // const [isUpdated, setIsUpdated] = useState(false)
    let navigate = useNavigate()

    let { id } = useParams();
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    const orderId = id;
    const errMsg = (message = '') => toast.error(message, {
        position: 'bottom-center'
    });

    const successMsg = (message = '') => toast.success(message, {
        position: 'bottom-center'
    });

    // const getOrderDetails = async (id) => {
    //     try {
    //         const config = {
    //             headers: {

    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }

    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/order/${id}`, config)
    //         setOrder(data.order)
    //         setLoading(false)
    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }
    // const updateOrder = async (id, formData) => {

    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/order/${id}`, formData, config)
    //         setIsUpdated(data.success)


    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }

    // useEffect(() => {
    //     getOrderDetails(orderId)
    //     if (error) {
    //         errMsg(error);
    //         setError('')
    //     }
    //     if (isUpdated) {
    //         successMsg('Order updated successfully');
    //         setIsUpdated('')
    //         navigate('/admin/orders')
    //     }
    // }, [error, isUpdated, orderId])

    useEffect(() => {
        dispatch(getOrderDetails(orderId))
        if (error) {
            errMsg(error);
            dispatch(clearErrors())
            // setError('')
        }
        if (isUpdated) {
            successMsg('Order updated successfully');
            dispatch({ type: UPDATE_ORDER_RESET })

            // setIsUpdated('')
            navigate('/admin/orders')
        }
    }, [error, isUpdated, orderId])

    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set('status', status);
        dispatch(updateOrder(id, formData))
    }

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    // the order statuses the admin can set, in order (same steps as ListOrders.jsx and OrderDetails.jsx)
    const orderSteps = ['Processing', 'Shipped', 'Delivered']
    const statusIndex = orderSteps.indexOf(orderStatus)
    const steps = ['Placed', 'Processing', 'Shipped', 'Delivered']

    // the store can still hold an earlier order, so only show it when it matches the URL
    const orderLoaded = order._id === id
    return (
        <>
            <MetaData title={`Process Order # ${order && order._id}`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <section className="orders-page order-details-page admin-order-page">
                        <div className="container-fluid py-5">
                            <div className="row justify-content-center">
                                <div className="col-12 col-lg-10">
                                    <h1 className="orders-page-title mb-4">Process Order</h1>

                                    {loading ? <Loader /> : orderLoaded ? (
                                        <div className="order-card">
                                            <div className="order-card-header d-flex flex-wrap justify-content-between align-items-start">
                                                <div className="mr-3">
                                                    <p className="mb-1"><span className="text-muted">Order ID</span> <b className="order-card-id">{order._id}</b></p>
                                                    <p className="mb-0"><span className="text-muted">Placed on</span> <b>{String(order.createdAt).substring(0, 10)}</b></p>
                                                    {orderStatus === 'Delivered' && order.deliveredAt && (
                                                        <p className="mb-0 mt-1"><span className="text-muted">Delivered on</span> <b>{String(order.deliveredAt).substring(0, 10)}</b></p>
                                                    )}
                                                </div>
                                                <span className={`badge order-status-badge ${orderStatus === 'Delivered' ? 'delivered' : orderStatus === 'Processing' ? 'processing' : 'other'}`}>
                                                    {orderStatus}
                                                </span>
                                            </div>

                                            <div className="order-details-section">
                                                <ul className="order-stepper">
                                                    {steps.map((step, index) => (
                                                        <li
                                                            key={step}
                                                            className={`${index <= statusIndex + 1 ? 'active' : ''} ${index + 1 <= statusIndex + 1 ? 'done' : ''}`}
                                                        >
                                                            <span className="step-dot">{index + 1}</span>
                                                            {step.toUpperCase()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="order-details-section">
                                                <h5 className="order-details-heading">Customer & Shipping</h5>
                                                {user && <p className="mb-1"><span className="text-muted">Name:</span> {user.name}</p>}
                                                {user && <p className="mb-1"><span className="text-muted">Email:</span> {user.email}</p>}
                                                <p className="mb-1"><span className="text-muted">Phone:</span> {shippingInfo && shippingInfo.phoneNo}</p>
                                                <p className="mb-0"><span className="text-muted">Address:</span> {shippingDetails}</p>
                                            </div>

                                            <div className="order-details-section">
                                                <h5 className="order-details-heading">Payment</h5>
                                                <p className={`mb-1 ${isPaid ? 'greenColor' : 'redColor'}`}><b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>
                                                {paymentInfo && paymentInfo.id && (
                                                    <p className="mb-0"><small className="text-muted">Stripe ID: {paymentInfo.id}</small></p>
                                                )}
                                            </div>

                                            <div className="order-details-section">
                                                <h5 className="order-details-heading">Order Items</h5>
                                                {orderItems && orderItems.map(item => (
                                                    <div key={item._id} className="order-item d-flex flex-wrap align-items-center">
                                                        <div className="flex-fill order-item-text">
                                                            <h5 className="mb-1">
                                                                {item.product ? <Link to={`/product/${item.product}`} className="order-item-link">{item.name}</Link> : item.name}
                                                            </h5>
                                                            <p className="text-muted mb-1">Qty: {item.quantity}</p>
                                                            <p className="mb-0">₱{Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                        </div>
                                                        <img src={item.image} alt={item.name} className="order-item-image rounded" />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="order-details-section text-right">
                                                <p className="mb-1"><span className="text-muted">Items:</span> ₱{Number(order.itemsPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                <p className="mb-1"><span className="text-muted">Shipping:</span> ₱{Number(order.shippingPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                <p className="mb-2"><span className="text-muted">Tax:</span> ₱{Number(order.taxPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                <p className="order-card-total mb-0">Total: ₱{Number(totalPrice || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            </div>

                                            <div className="order-details-section admin-order-status">
                                                <h5 className="order-details-heading">Update Status</h5>
                                                <div className="d-flex flex-wrap align-items-center">
                                                    <div className="form-group mb-2 mr-3">
                                                        <select
                                                            className="form-control"
                                                            name='status'
                                                            value={status}
                                                            onChange={(e) => setStatus(e.target.value)}
                                                        >
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                        </select>
                                                    </div>
                                                    <button className="btn btn-primary mb-2" onClick={() => updateOrderHandler(order._id)}>
                                                        Update Status
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="order-card-footer">
                                                <Link to="/admin/orders" className="btn btn-block order-card-btn">Back to Orders</Link>
                                            </div>
                                        </div>
                                    ) : (orderError || loading === false) && (
                                        <div className="orders-empty text-center py-5">
                                            <p className="mb-3">Order not found.</p>
                                            <Link to="/admin/orders" className="btn orders-shop-btn">Back to Orders</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
export default ProcessOrder