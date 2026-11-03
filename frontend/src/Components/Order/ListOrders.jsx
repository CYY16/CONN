import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { getToken } from '../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { myOrders } from '../../actions/orderActions'

const ListOrders = ({ filter = 'all' }) => {
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector(state => state.myOrders);
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState('')
    // const [myOrdersList, setMyOrdersList] = useState([])

    // const myOrders = async () => {
    //     try {
    //         const config = {
    //             headers: {
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/orders/me`, config)
    //         console.log(data)
    //         setMyOrdersList(data.orders)
    //         setLoading(false)

    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }
    // useEffect(() => {
    //     myOrders();
    //     if (error) {
    //         toast.error(error, {
    //             position: toast.POSITION.BOTTOM_RIGHT
    //         });
    //     }
    // }, [error])

    // the order statuses the admin can set, in order (see Admin/ProcessOrder.jsx)
    const orderSteps = ['Processing', 'Shipped', 'Delivered']
    const filteredOrders = orders.filter(order => {
        if (filter === 'ongoing') return order.orderStatus !== 'Delivered'
        if (filter === 'complete') return order.orderStatus === 'Delivered'
        return true
    })
    const pageTitle = filter === 'ongoing'
        ? 'On going orders'
        : filter === 'complete'
            ? 'Complete orders'
            : 'My Orders'

    useEffect(() => {
        dispatch(myOrders());
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }
    }, [error, dispatch])



    return (
        <>
            <MetaData title={pageTitle} />
            <section className="orders-page">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <h1 className="orders-page-title mb-4">{pageTitle}</h1>

                            {loading ? <Loader /> : (
                                <>
                                    {filteredOrders.length === 0 && (
                                        <div className="orders-empty text-center py-5">
                                            <p className="mb-3">No orders here yet.</p>
                                            <Link to="/" className="btn orders-shop-btn">Start Shopping</Link>
                                        </div>
                                    )}

                                    {filteredOrders.map(order => {
                                        // PLACED is step 0; each later step is on once the order reaches that status
                                        const statusIndex = orderSteps.indexOf(order.orderStatus)
                                        const steps = ['Placed', 'Processing', 'Shipped', 'Delivered']
                                        return (
                                            <div key={order._id} className="order-card">
                                                <div className="order-card-header d-flex flex-wrap justify-content-between align-items-start">
                                                    <div className="mr-3">
                                                        <p className="mb-1"><span className="text-muted">Order ID</span> <b className="order-card-id">{order._id}</b></p>
                                                        <p className="mb-0"><span className="text-muted">Placed on</span> <b>{String(order.createdAt).substring(0, 10)}</b></p>
                                                    </div>
                                                    <Link to={`/order/${order._id}`} className="order-card-link">View Details</Link>
                                                </div>

                                                <div className="order-card-body">
                                                    {order.orderItems.map(item => (
                                                        <div key={item._id} className="order-item d-flex flex-wrap align-items-center">
                                                            <div className="flex-fill order-item-text">
                                                                <h5 className="mb-1">{item.name}</h5>
                                                                <p className="text-muted mb-1">Qty: {item.quantity}</p>
                                                                <p className="mb-0">₱{Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                            </div>
                                                            <img src={item.image} alt={item.name} className="order-item-image rounded" />
                                                        </div>
                                                    ))}

                                                    <p className="order-card-total text-right mb-4">
                                                        <small className="text-muted mr-2">
                                                            {order.paymentInfo && order.paymentInfo.status === 'succeeded' ? 'Paid' : 'Not paid'}
                                                        </small>
                                                        Total: ₱{Number(order.totalPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>

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

                                                <div className="order-card-footer">
                                                    <Link to={`/order/${order._id}`} className="btn btn-block order-card-btn">View Details</Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ListOrders