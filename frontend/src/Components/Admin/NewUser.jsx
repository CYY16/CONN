import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createUser, clearErrors } from '../../actions/userActions'
import { NEW_USER_RESET } from '../../constants/userConstants'

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2QzZDNkMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';

const NewUser = () => {
    const dispatch = useDispatch()
    const { loading, error, success } = useSelector(state => state.newUser)

    const [avatar, setAvatar] = useState(defaultAvatar)
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar)

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: ''
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
                .required('Password is required'),
            role: Yup.string()
                .required('Role is required')
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('email', values.email);
            formData.set('password', values.password);
            formData.set('role', values.role);
            formData.set('avatar', avatar);

            dispatch(createUser(formData))
        }
    })

    const onChange = e => {
        const file = e.target.files[0]
        // cancelling the file picker leaves no file: go back to the default
        if (!file) {
            setAvatar(defaultAvatar)
            setAvatarPreview(defaultAvatar)
            return
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' });
            dispatch(clearErrors())
        }

        if (success) {
            navigate('/admin/users');
            toast.success('User created', { position: 'bottom-right' })
            dispatch({ type: NEW_USER_RESET })
        }
    }, [error, dispatch, navigate, success])

    return (
        <>
            <MetaData title={'New User'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                        <form className="shadow-lg" onSubmit={formik.handleSubmit} encType='multipart/form-data' noValidate>
                            <h1 className="mb-4">New User</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input type="text" id="name_field" className="form-control" {...formik.getFieldProps('name')} />
                                {formik.touched.name && formik.errors.name && (
                                    <small className="text-danger">{formik.errors.name}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input type="email" id="email_field" className="form-control" {...formik.getFieldProps('email')} />
                                {formik.touched.email && formik.errors.email && (
                                    <small className="text-danger">{formik.errors.email}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_field">Password</label>
                                <input type="password" id="password_field" className="form-control" {...formik.getFieldProps('password')} />
                                {formik.touched.password && formik.errors.password && (
                                    <small className="text-danger">{formik.errors.password}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="role_field">Role</label>
                                <select id="role_field" className="form-control" {...formik.getFieldProps('role')}>
                                    <option value="" disabled>Select a role</option>
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                </select>
                                {formik.touched.role && formik.errors.role && (
                                    <small className="text-danger">{formik.errors.role}</small>
                                )}
                            </div>

                            <div className='form-group'>
                                <label htmlFor='customFile'>Avatar</label>
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
                                        <input type='file' id='customFile' className='custom-file-input' accept='image/*' onChange={onChange} />
                                        <label className='custom-file-label' htmlFor='customFile'>Choose Avatar</label>
                                    </div>
                                </div>
                            </div>

                            <button id="login_button" type="submit" className="btn btn-block py-3" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm mr-2"></span>Creating...</>
                                ) : 'CREATE'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewUser
