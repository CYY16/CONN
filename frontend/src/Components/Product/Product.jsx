import React from 'react'
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
    return (
        // <ProductDetails item={item} />
        <div className="col-12 col-sm-6 col-lg-4 my-3">
            <div className="card product-card listing-card rounded">
                <div className="product-card-image">
                    <img
                        className="card-img-top mx-auto"
                        src={product.images[0] ? product.images[0].url : null}
                        alt={product.name}
                    />
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                        {/* <a href="{`/product/${product._id}`}">{product.name}</a> */}
                        <Link to={`/product/${product._id}`} >{product.name}</Link>
                    </h5>
                    <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews">({product.numOfReviews} reviews)</span>
                    </div>
                    <p className="card-text">₱{Number(product.price).toLocaleString()}</p>
                    <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">VIEW DETAILS</Link>
                </div>
            </div>
        </div>
    )
}

export default Product