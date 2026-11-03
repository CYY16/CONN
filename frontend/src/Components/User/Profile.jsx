import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'

import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { getToken } from '../Utils/helpers';
import { useSelector } from 'react-redux'

const Profile = () => {
    const { user, loading } = useSelector(state => state.auth)

    // const [loading, setLoading] = useState(true)
    // const [user, setUser] = useState({})


    // const getProfile = async () => {
    //     const config = {
    //         headers: {
    //             'Authorization': `Bearer ${getToken()}`
    //         }
    //     }
    //     try {
    //         const { data } = await axios.get(`http://localhost:4001/api/v1/me`, config)
    //         console.log(data.user)
    //         setUser(data.user)
    //         setLoading(false)
    //     } catch (error) {
    //         console.log(error)
    //         toast.error("invalid user or password", {
    //             position: 'bottom-center'
    //         })
    //     }

    // }

    // useEffect(() => {

    //     getProfile()

    // }, [])
    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Your Profile'} />

                    <section className="profile-page">
                        <div className="container py-5">
                            <div className="row">
                                <div className="col">
                                    <nav aria-label="breadcrumb" className="profile-breadcrumb rounded-3 p-3 mb-4">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Profile</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="card profile-card mb-4">
                                        <div className="card-body text-center">
                                            <img
                                                src={user.avatar ? user.avatar.url : null}
                                                alt={user.name}
                                                className="rounded-circle img-fluid profile-avatar"
                                                style={{ width: '150px' }}
                                            />
                                            <h5 className="my-3">{user.name}</h5>
                                            <p className="text-muted mb-4">{user.email}</p>
                                            <div className="d-flex flex-wrap justify-content-center mb-2">
                                                <Link to="/me/update" className="btn profile-btn m-1">Edit Profile</Link>
                                                <Link to="/password/update" className="btn profile-btn-outline m-1">Change Password</Link>
                                            </div>
                                        </div>
                                    </div>

                                    {user.role !== 'admin' && (
                                        <div className="card profile-card mb-4 mb-lg-0">
                                            <div className="card-body p-0">
                                                <ul className="list-group list-group-flush rounded-3">
                                                    <li className="list-group-item p-0">
                                                        <Link to="/orders/me" className="profile-link d-flex align-items-center p-3">
                                                            <i className="fa fa-list-alt fa-lg mr-3" aria-hidden="true"></i>
                                                            <span>My Orders</span>
                                                        </Link>
                                                    </li>
                                                    <li className="list-group-item p-0">
                                                        <Link to="/orders/me/ongoing" className="profile-link d-flex align-items-center p-3">
                                                            <i className="fa fa-truck fa-lg mr-3" aria-hidden="true"></i>
                                                            <span>Ongoing Orders</span>
                                                        </Link>
                                                    </li>
                                                    <li className="list-group-item p-0">
                                                        <Link to="/orders/me/complete" className="profile-link d-flex align-items-center p-3">
                                                            <i className="fa fa-check-circle fa-lg mr-3" aria-hidden="true"></i>
                                                            <span>Completed Orders</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-8">
                                    <div className="card profile-card mb-4">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Full Name</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{user.name}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Email</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{user.email}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Joined On</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{String(user.createdAt).substring(0, 10)}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Role</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{user.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    )
}

export default Profile