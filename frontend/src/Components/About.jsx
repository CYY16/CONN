import { Link } from 'react-router-dom'
import MetaData from './Layout/MetaData'

const About = () => (
    <>
        <MetaData title="About" />
        <section className="orders-page about-us-page">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <h1 className="orders-page-title mb-4">About Us</h1>

                        <div className="order-card about-card">
                            <h4 className="about-card-title">Who We Are</h4>
                            <p className="mb-0">
                                CONN Moto is an online shop for motorcycles from Honda, Yamaha, Suzuki and Kawasaki.
                                You can browse our units by brand, transmission (automatic, manual or semi manual),
                                price and rating, then order the one that fits the way you ride.
                            </p>
                        </div>

                        <div className="order-card about-card">
                            <h4 className="about-card-title">Our Mission</h4>
                            <p className="mb-0">
                                We want buying a motorcycle to be simple: clear prices, honest product details and
                                an order you can follow from checkout until it reaches you.
                            </p>
                        </div>

                        <div className="order-card about-card">
                            <h4 className="about-card-title">Why Shop With Us</h4>
                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                    <i className="fa fa-motorcycle about-icon mr-2" aria-hidden="true"></i>
                                    <b>Trusted brands</b>
                                    <p className="text-muted mb-0">Units from Honda, Yamaha, Suzuki and Kawasaki in one place.</p>
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                    <i className="fa fa-shopping-cart about-icon mr-2" aria-hidden="true"></i>
                                    <b>Easy ordering</b>
                                    <p className="text-muted mb-0">Add to cart, enter your shipping details and check out in a few steps.</p>
                                </div>
                                <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                                    <i className="fa fa-truck about-icon mr-2" aria-hidden="true"></i>
                                    <b>Order tracking</b>
                                    <p className="text-muted mb-0">See every order in My Orders, from Placed to Delivered.</p>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <i className="fa fa-star about-icon mr-2" aria-hidden="true"></i>
                                    <b>Real reviews</b>
                                    <p className="text-muted mb-0">Read ratings from other buyers and leave your own after you ride.</p>
                                </div>
                            </div>
                        </div>

                        <div className="order-card about-card">
                            <h4 className="about-card-title">Contact Us</h4>
                            <p className="mb-1"><i className="fa fa-envelope about-icon mr-2" aria-hidden="true"></i>CONN@conn.com</p>
                            <p className="mb-1"><i className="fa fa-phone about-icon mr-2" aria-hidden="true"></i>09486928600</p>
                            <p className="mb-0"><i className="fa fa-map-marker about-icon mr-2" aria-hidden="true"></i>Taguig City</p>
                        </div>

                        <div className="text-center">
                            <Link to="/" className="btn orders-shop-btn">Start Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
)

export default About
