import React, { useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { errMsg, successMsg, getToken } from '../Utils/helpers'

// import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, getUserDetails, clearErrors } from '../../actions/userActions'
import { UPDATE_USER_RESET } from '../../constants/userConstants'

const UpdateUser = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const { error, isUpdated, loading } = useSelector(state => state.user);
    const { user } = useSelector(state => state.userDetails)
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState('')
    // const [user, setUser] = useState(true)
    // const [isUpdated, setIsUpdated] = useState(false)
    const errMsg = (message = '') => toast.error(message, {
        position: 'bottom-right'
    });
    const successMsg = (message = '') => toast.success(message, {
        position: 'bottom-right'
    });

    const { id } = useParams();
    // const config = {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${getToken()}`
    //     }
    // }
    // const getUserDetails = async (id) => {

    //     try {
    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/user/${id}`, config)
    //         setUser(data.user)
    //         setLoading(false)

    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }

    // const updateUser = async (id, userData) => {
    //     try {
    //         const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/user/${id}`, userData, config)
    //         setIsUpdated(data.success)
    //         setLoading(false)

    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }

    // useEffect(() => {
    //     // console.log(user && user._id !== userId);
    //     if (user && user._id !== id) {
    //         getUserDetails(id)
    //     } else {
    //         setName(user.name);
    //         setEmail(user.email);
    //         setRole(user.role)
    //     }
    //     if (error) {
    //         errMsg(error);
    //         setError('');
    //     }
    //     if (isUpdated) {
    //         successMsg('User updated successfully')
    //         navigate('/admin/users')

    //     }
    // }, [error, isUpdated, id, user])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user && user._id === id ? user.name : '',
            email: user && user._id === id ? user.email : '',
            role: user && user._id === id ? user.role : '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .trim()
                .max(30, 'Name cannot exceed 30 characters')
                .required('Name is required'),
            email: Yup.string()
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
                .required('Email is required'),
            role: Yup.string()
                .required('Role is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .when('password', {
                    is: (password) => !!password,
                    then: (schema) => schema
                        .oneOf([Yup.ref('password')], 'Passwords do not match')
                        .required('Please confirm the new password')
                })
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('email', values.email);
            formData.set('role', values.role);
            if (values.password !== '') {
                formData.set('password', values.password);
            }
            dispatch(updateUser(id, formData))
        }
    })

    useEffect(() => {

        // console.log(user && user._id !== userId);
        if (user && user._id !== id) {
            dispatch(getUserDetails(id))
        }

        if (error) {
            errMsg(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            successMsg('User updated')

            navigate('/admin/users')

            dispatch({
                type: UPDATE_USER_RESET
            })
        }

    }, [dispatch, error, navigate, isUpdated, id, user])

    return (
        <>
            <MetaData title={`Update User`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={formik.handleSubmit} noValidate>
                                <h1 className="mt-2 mb-5">Update User</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="name"
                                        id="name_field"
                                        className="form-control"
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <small className="text-danger">{formik.errors.name}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <small className="text-danger">{formik.errors.email}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role_field">Role</label>
                                    <select
                                        id="role_field"
                                        className="form-control"
                                        {...formik.getFieldProps('role')}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                    {formik.touched.role && formik.errors.role && (
                                        <small className="text-danger">{formik.errors.role}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password_field">New Password (leave blank to keep current)</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                        autoComplete="new-password"
                                        {...formik.getFieldProps('password')}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <small className="text-danger">{formik.errors.password}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirm_password_field">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirm_password_field"
                                        className="form-control"
                                        autoComplete="new-password"
                                        {...formik.getFieldProps('confirmPassword')}
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <small className="text-danger">{formik.errors.confirmPassword}</small>
                                    )}
                                </div>
                                <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm mr-2"></span>Updating...</>
                                    ) : 'Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateUser