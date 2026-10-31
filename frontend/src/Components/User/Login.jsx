import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Loader from '../Layout/Loader'
import { login, googleLogin, clearErrors } from '../../actions/userActions'

const Login = () => {
    const { isAuthenticated, error, loading } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
        }),
        onSubmit: (values) => {
            dispatch(login(values.email, values.password))
        }
    })

    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''

    useEffect(() => {
        if (isAuthenticated && redirect === 'shipping') {
            navigate(`/${redirect}`)
        } else if (isAuthenticated) {
            navigate('/')
        }

        if (error) {
            dispatch(clearErrors());
        }
    }, [error, isAuthenticated, dispatch, navigate, redirect])

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={formik.handleSubmit} noValidate>
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="invalid-feedback">{formik.errors.email}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('password')}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="invalid-feedback">{formik.errors.password}</div>
                                    )}
                                </div>

                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
                                <button id="login_button" type="submit" className="btn btn-block py-3">LOGIN</button>
                                <Link to="/register" className="float-right mt-3">Register Here</Link>
                            </form>
                            <button type="button" className="btn btn-outline-dark btn-block py-3 mt-3" onClick={() => dispatch(googleLogin())}>
                                <i className="fa fa-google mr-2"></i> Sign in with Google
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Login
