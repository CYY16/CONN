import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getOrderDetails } from '../../actions/orderActions'

// import { getToken } from '../Utils/helpers'

const OrderDetails = () => {
    const dispatch = useDispatch();
    const { loading, error, order = {} } = useSelector(state => state.orderDetails);
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState('')
    // const [order, setOrder] = useState({})

    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    let { id } = useParams();

    // const getOrderDetails = async (id) => {
    //     try {

    //         const config = {
    //             headers: {
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }

    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/order/${id}`, config)
    //         console.log(data)
    //         setOrder(data.order)

    //         setLoading(false)


    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }

    useEffect(() => {
        dispatch(getOrderDetails(id))

        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }
    }, [error, id])

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    // the order statuses the admin can set, in order (same steps as ListOrders.jsx)
    const orderSteps = ['Processing', 'Shipped', 'Delivered']
    const statusIndex = orderSteps.indexOf(orderStatus)
    const steps = ['Placed', 'Processing', 'Shipped', 'Delivered']

    // the store can still hold an earlier order, so only show it when it matches the URL
    const orderLoaded = order._id === id

    return (
        <>
            <MetaData title={'Order Details'} />

            <section className="orders-page order-details-page">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <h1 className="orders-page-title mb-4">Order Details</h1>

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

                                    <div className="order-details-section">
                                        <h5 className="order-details-heading">Shipping Info</h5>
                                        {user && <p className="mb-1"><span className="text-muted">Name:</span> {user.name}</p>}
                                        {user && <p className="mb-1"><span className="text-muted">Email:</span> {user.email}</p>}
                                        <p className="mb-1"><span className="text-muted">Phone:</span> {shippingInfo && shippingInfo.phoneNo}</p>
                                        <p className="mb-0"><span className="text-muted">Address:</span> {shippingDetails}</p>
                                    </div>

                                    <div className="order-details-section">
                                        <h5 className="order-details-heading">Payment</h5>
                                        <p className={`mb-1 ${isPaid ? 'greenColor' : 'redColor'}`}><b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>
                                        {paymentInfo && paymentInfo.id && (
                                            <p className="mb-0"><small className="text-muted">Payment ID: {paymentInfo.id}</small></p>
                                        )}
                                    </div>

                                    <div className="order-details-section text-right">
                                        <p className="mb-1"><span className="text-muted">Items:</span> ₱{Number(order.itemsPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        <p className="mb-1"><span className="text-muted">Shipping:</span> ₱{Number(order.shippingPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        <p className="mb-2"><span className="text-muted">Tax:</span> ₱{Number(order.taxPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        <p className="order-card-total mb-0">Total: ₱{Number(totalPrice || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>

                                    <div className="order-card-footer">
                                        <Link to="/orders/me/ongoing" className="btn btn-block order-card-btn">Back to My Orders</Link>
                                    </div>
                                </div>
                            ) : (error || loading === false) && (
                                <div className="orders-empty text-center py-5">
                                    <p className="mb-3">Order not found.</p>
                                    <Link to="/orders/me/ongoing" className="btn orders-shop-btn">Back to My Orders</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default OrderDetails