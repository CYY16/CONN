import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { getToken } from '../Utils/helpers';
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createOrder, clearErrors } from '../../actions/orderActions'
import { clearCart } from '../../actions/cartActions';



const Payment = () => {
    // const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();
    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { error, loading, order: createdOrder } = useSelector(state => state.newOrder)
    const [submitted, setSubmitted] = useState(false)
    let navigate = useNavigate();
    // useEffect(() => {
    // }, [])
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' });
            setSubmitted(false)
            dispatch(clearErrors())
        }

        if (submitted && !loading && !error && createdOrder) {
            dispatch(clearCart())
            toast.success('Order placed', { position: 'bottom-right' });
            navigate('/success')
        }

    }, [dispatch, error, loading, submitted, createdOrder, navigate])

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    // const createOrder = async (order) => {
    //     console.log(order)
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.post(`${import.meta.env.VITE_API}/order/new`, order, config)
    //         // setIsUpdated(data.success)
    //         setLoading(false)
    //         toast.success('order created', {
    //             position: toast.POSITION.BOTTOM_RIGHT
    //         });

    //         // sessionStorage.removeItem('orderInfo')
    //         // navigate('/success')

    //     } catch (error) {
    //         toast.error(error.response.data.message, {
    //             position: toast.POSITION.BOTTOM_RIGHT
    //         });
    //     }
    // }

    const formik = useFormik({
        initialValues: {
            cardNumber: '',
            expiry: '',
            cvc: ''
        },
        validationSchema: Yup.object({
            cardNumber: Yup.string()
                .matches(/^\d{16}$/, 'Card number must be 16 digits')
                .required('Card number is required'),
            expiry: Yup.string()
                .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format')
                .required('Card expiry is required'),
            cvc: Yup.string()
                .matches(/^\d{3,4}$/, 'CVC must be 3 or 4 digits')
                .required('CVC is required')
        }),
        onSubmit: () => {
            order.paymentInfo = {
                id: 'pi_1DpdYh2eZvKYlo2CYIynhU32',
                status: 'succeeded'
            }
            dispatch(createOrder(order))
            setSubmitted(true)
        }
    })

    return (
        <>
            <MetaData title={'Payment'} />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={formik.handleSubmit} noValidate>
                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <input
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                {...formik.getFieldProps('cardNumber')}
                            />
                            {formik.touched.cardNumber && formik.errors.cardNumber && (
                                <small className="text-danger">{formik.errors.cardNumber}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <input
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                {...formik.getFieldProps('expiry')}
                            />
                            {formik.touched.expiry && formik.errors.expiry && (
                                <small className="text-danger">{formik.errors.expiry}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <input
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                {...formik.getFieldProps('cvc')}
                            />
                            {formik.touched.cvc && formik.errors.cvc && (
                                <small className="text-danger">{formik.errors.cvc}</small>
                            )}
                        </div>
                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm mr-2"></span>Processing...</>
                            ) : `Pay - ${orderInfo && orderInfo.totalPrice}`}
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}

export default Payment