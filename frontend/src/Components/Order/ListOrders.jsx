import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { getToken } from '../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { myOrders } from '../../actions/orderActions'

import {

    Button
} from '@mui/material'


import { DataGrid, } from '@mui/x-data-grid'

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

    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            flex: 1,
            renderCell: (params) => <span style={{ wordBreak: 'break-all' }}>{params.value}</span>
        },
        {
            field: 'numOfItems',
            headerName: 'Num of Items',
            type: 'number',
            width: 130,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 120,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 160,
            renderCell: (params) =>
                (params.value && String(params.value).includes('Delivered'))
                    ? <span style={{ color: 'green' }}>{params.value}</span>
                    : <span style={{ color: 'red' }}>{params.value}</span>
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Button
                    component={Link}
                    to={`/order/${params.id}`}
                    variant="contained"
                    size="small"
                >
                    <i className="fa fa-eye" />
                </Button>
            )
        }
    ];

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

    const rows = filteredOrders.map(order => ({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status: order.orderStatus || ''
    }));
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
            <h1 className="my-5">{pageTitle}</h1>




            {loading ? <Loader /> : (
                <div style={{ width: '100%' }}>
                    {filteredOrders.length === 0 ? (
                        <p className="text-center py-5">No {filter === 'complete' ? 'completed' : 'ongoing'} orders found.</p>
                    ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}

                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        disableSelectionOnClick
                        getRowId={(row) => row.id}
                        showToolbar
                    />
                    )}
                </div>
            )}
        </>
    )
}

export default ListOrders