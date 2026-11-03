import React, { useState, useEffect } from 'react'
import { useParams, } from 'react-router-dom'
import MetaData from '../Layout/MetaData'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListReviews from '../Review/ListReviews';

import { successMsg, errMsg } from '../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails, newReview, clearErrors, } from '../../actions/productActions'
import { addItemToCart } from '../../actions/cartActions'
import { NEW_REVIEW_RESET } from '../../constants/productConstants'
const ProductDetails = () => {
    // const [product, setProduct] = useState({})
    const { loading, error, product } = useSelector(state => state.productDetails);
    const { user } = useSelector(state => state.auth)
    const { error: reviewError, success } = useSelector(state => state.newReview)
    const [quantity, setQuantity] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [mainImage, setMainImage] = useState('')
    let { id } = useParams()
    const dispatch = useDispatch()
    // const productDetails = async (id) => {
    //     let link = `http://localhost:4001/api/v1/product/${id}`
    //     try {
    //         let res = await axios.get(link)
    //         setProduct(res.data.product)
    //     } catch (err) {
    //         console.log(err)
    //         // setError('Product not found')
    //     }
    // }

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty)
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber <= 1) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty)
    }

    const addToCart = async () => {
        const added = await dispatch(addItemToCart(id, quantity));
        if (added) {
            toast.success('Added to cart', { position: 'bottom-right' });
        } else {
            toast.error('Could not add to cart', { position: 'bottom-right' });
        }
    }

    function setUserRatings() {
        const stars = document.querySelectorAll('.star');
        let myReview = null
        if (product.reviews) {
            myReview = product.reviews.find(r => r.user === user._id)
        }
        if (myReview) {
            setRating(myReview.rating)
            setComment(myReview.comment)
        }
        stars.forEach((star, index) => {
            star.starValue = index + 1;
            if (myReview && index < myReview.rating) {
                star.classList.add('orange')
            }
            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })
        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');
                        setRating(this.starValue)
                    } else {
                        star.classList.remove('orange')
                    }
                }
                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow')
                    }
                }
                if (e.type === 'mouseout') {
                    star.classList.remove('yellow')
                }
            })
        }
    }

    const reviewHandler = () => {
        const formData = new FormData();
        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', id);
        dispatch(newReview(formData))

    }

    useEffect(() => {
        dispatch(getProductDetails(id))

        if (reviewError) {
            errMsg(reviewError)
            dispatch(clearErrors())
        }

        if (success) {
            successMsg('Review posted successfully')
            dispatch({ type: NEW_REVIEW_RESET })
        }

    }, [dispatch, id, reviewError, success]);

    // show the first image whenever a product loads
    useEffect(() => {
        if (product.images && product.images.length > 0) {
            setMainImage(product.images[0].url)
        }
    }, [product]);

    // useEffect(() => {
    //     localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // }, [cartItems]);

    return (
        <>
            <MetaData title={product.name} />
            <div className="container mt-5 product-page">
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="img-fluid rounded product-main-image"
                        />
                        {product.images && product.images.length > 1 && (
                            <div className="d-flex flex-wrap product-thumbs">
                                {product.images.map(image => (
                                    <img
                                        key={image.public_id}
                                        src={image.url}
                                        alt={product.name}
                                        className={`rounded product-thumb ${mainImage === image.url ? 'active' : ''}`}
                                        onClick={() => setMainImage(image.url)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <h2 className="product-page-name">{product.name}</h2>

                        <p className="product-page-price">₱{Number(product.price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

                        <div className="d-flex align-items-center mb-3">
                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span className="product-page-reviews ml-2">({product.numOfReviews} reviews)</span>
                        </div>

                        <span className={`badge product-stock-badge mb-3 ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>

                        <p className="product-page-description">{product.description}</p>

                        <p className="product-page-meta mb-1"><span>Brand:</span> {product.seller}</p>
                        <p className="product-page-meta mb-4"><span>Transmission:</span> {product.category}</p>

                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <div className="input-group product-qty mr-3 mb-2">
                                <div className="input-group-prepend">
                                    <button type="button" className="btn product-qty-btn" aria-label="Decrease quantity" onClick={decreaseQty}>-</button>
                                </div>
                                <input type="number" className="form-control count text-center" value={quantity} readOnly />
                                <div className="input-group-append">
                                    <button type="button" className="btn product-qty-btn" aria-label="Increase quantity" onClick={increaseQty}>+</button>
                                </div>
                            </div>
                            <button type="button" className="btn btn-lg product-cart-btn mb-2" disabled={product.stock === 0} onClick={addToCart}>
                                <i className="fa fa-shopping-cart mr-2" aria-hidden="true"></i>Add to Cart
                            </button>
                        </div>

                        {user ? <button type="button" className="btn product-review-btn" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings} >
                            Submit Your Review
                        </button> :
                            <div className="alert product-login-alert" type='alert'>Login to post your review.</div>}

                        <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content product-review-modal">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                        <ul className="stars" >
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                        </ul>

                                        <textarea
                                            name="review"
                                            id="review" className="form-control mt-3"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}

                                        >
                                        </textarea>

                                        <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" onClick={reviewHandler} >Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {product.reviews && product.reviews.length > 0 && (
                    <div className="card product-reviews-card mt-4 mb-5">
                        <div className="card-body">
                            <ListReviews reviews={product.reviews} />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductDetails
