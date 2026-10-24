import '../../App.css'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { getUser, logout } from '../Utils/helpers';
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../actions/userActions'

import Search from './Search'
export const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)

    const logoutHandler = () => {
        dispatch(logout());
        toast.success('log out', {
            position: 'bottom-right'
        });
    }

    return (
        <>
            <nav className="site-header">
                <Link to="/" className="conn-brand" aria-label="CONN Moto home">
                    <span className="conn-brand-mark">
                        <i className="fa fa-motorcycle" aria-hidden="true"></i>
                    </span>
                    <span className="conn-brand-name">CONN <span>Moto</span></span>
                </Link>
                <div className="header-links">
                    <Link to="/" className="header-link">Home</Link>
                    <Link to="/#products" className="header-link">Shop</Link>
                    {user && (
                        <div className="dropdown header-orders-dropdown">
                            <button
                                className="header-link header-dropdown-toggle"
                                type="button"
                                id="myOrdersDropdown"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                My Orders <i className="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="myOrdersDropdown">
                                <Link className="dropdown-item" to="/orders/me/ongoing">On going orders</Link>
                                <Link className="dropdown-item" to="/orders/me/complete">Complete orders</Link>
                            </div>
                        </div>
                    )}
                    <Link to="/about" className="header-link">About</Link>
                </div>
                <Search />
                <div className="header-actions">
                    {user ? (<div className="dropdown d-inline">
                        <button className="btn dropdown-toggle header-account" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <figure className="avatar avatar-nav">
                                <img
                                    src={user.avatar && user.avatar.url}
                                    alt={user && user.name}
                                    className="rounded-circle"
                                />
                            </figure>
                            <span>{user && user.name}</span>
                        </button>

                        <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                            {user && user.role === 'admin' && (
                                <Link className="dropdown-item" to="/dashboard">Admin Mode</Link>
                            )}
                            <Link className="dropdown-item" to="/me">Profile</Link>

                            <Link
                                className="dropdown-item text-danger" to="/"
                                onClick={logoutHandler}
                            >
                                Logout
                            </Link>
                        </div>
                    </div>) : <Link to="/login" className="btn" id="login_btn">Login</Link>}

                    <Link to="/cart" className="header-cart">
                        <i className="fa fa-shopping-cart" aria-label="Cart"></i>
                        <span id="cart_count">{cartItems ? cartItems.length : null}</span>
                    </Link>
                </div>
            </nav>
        </>
    )
}
