import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
// import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register, googleLogin, clearErrors } from '../../actions/userActions'


const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2QzZDNkMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';

const Register = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    // const [user, setUser] = useState({
    //     name: '',
    //     email: '',
    //     password: '',
    // })

    const [avatar, setAvatar] = useState(defaultAvatar)
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar)

    // const [error, setError] = useState('')
    // const [loading, setLoading] = useState(true)


    let navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }

        if (error) {
            if (error !== 'Login first to access this resource') {
                toast.error(error, { position: 'bottom-right' });
            }
            dispatch(clearErrors());
        }

    }, [error, navigate, isAuthenticated, dispatch])

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .trim()
                .max(30, 'Name cannot exceed 30 characters')
                .required('Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required')
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('email', values.email);
            formData.set('password', values.password);
            formData.set('avatar', avatar || defaultAvatar);

            dispatch(register(formData))
        }
    })

    const onChange = e => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])
    }

    // const register = async (userData) => {
    //     console.log(userData)
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         }

    //         const { data } = await axios.post(`http://localhost:4001/api/v1/register`, userData, config)
    //         console.log(data.user)

    //         setLoading(false)
    //         setUser(data.user)
    //         navigate('/')

    //     } catch (error) {
    //         setLoading(false)
    //         setUser(null)
    //         setError(error.response.data.message)
    //         console.log(error.response.data.message)
    //     }
    // }




    return (
        <>

            <MetaData title={'Register User'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={formik.handleSubmit} encType='multipart/form-data' noValidate>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
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
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <small className="text-danger">{formik.errors.password}</small>
                            )}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm mr-2"></span>REGISTERING...</>
                            ) : 'REGISTER'}
                        </button>
                    </form>
                    <button type="button" className="btn btn-outline-dark btn-block py-3 mt-3" disabled={loading} onClick={() => dispatch(googleLogin())}>
                        <i className="fa fa-google mr-2"></i> Sign up with Google
                    </button>
                </div>
            </div>

        </>
    )
}

export default Register