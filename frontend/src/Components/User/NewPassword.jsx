import  {  useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const NewPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    let navigate = useNavigate();
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    let { token } = useParams();
    console.log(token)

    const resetPassword = async (token, passwords) => {
        console.log(passwords)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.put(`http://localhost:4001/api/v1/password/reset/${token}`, passwords, config)
            
            setSuccess(data.success)
        } catch (error) {
            console.log(error)
            setError(error)
        }
    }
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }
        if (success) {
            toast.success('password updated', {
                position: 'bottom-right'
            });
            navigate('/login')
        }

    }, [error, success,])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);
        resetPassword(token, formData)
    }

    return (
        <>
            <MetaData title={'New Password Reset'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg auth-card" onSubmit={submitHandler}>
                        <img src="/images/CONN.png" alt="CONN" className="auth-logo" />
                        <h1 className="mb-4">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password_field"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" className="btn btn-outline-secondary" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}><i className={showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}></i></button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm_password_field"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button type="button" className="btn btn-outline-secondary" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword(!showConfirmPassword)}><i className={showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}></i></button>
                            </div>
                        </div>

                        <button
                            id="new_password_button"
                            type="submit"
                            className="btn btn-block py-3">
                            Set Password
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}

export default NewPassword