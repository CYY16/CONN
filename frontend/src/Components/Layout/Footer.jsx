import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <footer className="site-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-4 mb-4">
                            <h5 className="site-footer-brand">CONN Moto</h5>
                            <p className="mb-0">Built for the ride. Motorcycles from the brands you trust, ordered online.</p>
                        </div>

                        <div className="col-12 col-md-4 mb-4">
                            <h6 className="site-footer-heading">Quick Links</h6>
                            <ul className="list-unstyled mb-0">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/cart">Cart</Link></li>
                                <li><Link to="/orders/me">My Orders</Link></li>
                            </ul>
                        </div>

                        <div className="col-12 col-md-4 mb-4">
                            <h6 className="site-footer-heading">Contact</h6>
                            <p className="mb-1">CONN@conn.com</p>
                            <p className="mb-1">09486928600</p>
                            <p className="mb-0">Taguig City</p>
                        </div>
                    </div>
                </div>

                <div className="site-footer-bottom">
                    <small>© {new Date().getFullYear()} CONN Moto. All rights reserved.</small>
                </div>
            </footer>
        </>
    )
}

export default Footer
