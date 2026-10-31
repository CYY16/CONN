import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Product from './Product/Product'
// import products from '../products.json'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import MetaData from './Layout/MetaData'
import Loader from './Layout/Loader';
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'
import { motorcycleCategories } from '../constants/productOptions'

const Home = () => {
    // console.log(products)
    // const [products, setProducts] = useState([])
    const [price, setPrice] = useState([0, 10000]);
    const [category, setCategory] = useState('')
    const [ratings, setRatings] = useState(0)
    const [numOfReviews, setNumOfReviews] = useState(0)
    // const [loading, setLoading] = useState(true)
    // const [productsCount, setProductsCount] = useState(0)
    // const [resPerPage, setResPerPage] = useState(0)
    // const [filteredProductsCount, setFilteredProductsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [productList, setProductList] = useState([])
    const [priceOpen, setPriceOpen] = useState(true)
    const [ratingsOpen, setRatingsOpen] = useState(true)
    const [reviewsOpen, setReviewsOpen] = useState(true)
    let { keyword } = useParams();
    const [lastKeyword, setLastKeyword] = useState(keyword)
    const dispatch = useDispatch();
    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products);

    // new search keyword: go back to page 1 before the fetch effect runs
    if (keyword !== lastKeyword) {
        setLastKeyword(keyword)
        setCurrentPage(1)
    }

    let count = productsCount;

    if (keyword || category || ratings || numOfReviews) {
        count = filteredProductsCount
    }



    // const getProducts = async (keyword = '', price, page = 1) => {

    //     let link = `http://localhost:4001/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&page=${page}`
    //     // http://localhost:4001/api/v1/products?keyword=''
    //     // http://localhost:4001/api/v1/products?keyword=adid&page=1&price[gte]=100&price[lte]=1000
    //     let res = await axios.get(link)
    //     console.log(res.data.products)
    //     setProducts(res.data.products)
    //     setProductsCount(res.data.productsCount)
    //     setFilteredProductsCount(res.data.filteredProductsCount)
    //     setResPerPage(res.data.resPerPage)
    //     setLoading(false)
    // }

    const handleChange = (event, newValue) => {
        setPrice(newValue);
        setCurrentPage(1)
    };

    const categoryHandler = (value) => {
        setCategory(value)
        setCurrentPage(1)
    }

    const ratingsHandler = (value) => {
        setRatings(value)
        setCurrentPage(1)
    }

    const reviewsHandler = (value) => {
        setNumOfReviews(value)
        setCurrentPage(1)
    }

    const clearFiltersHandler = () => {
        setCategory('')
        setRatings(0)
        setNumOfReviews(0)
        setPrice([0, 10000])
        setCurrentPage(1)
    }

    function valuetext(price) {
        return `P${price.toString()}`;
    }

    function priceLabel(value) {
        return `₱${value / 1000}K`;
    }
    // getProducts()
    // useEffect(() => {
    //     // getProducts(keyword, price, currentPage)
    // }, [keyword, price, currentPage]);
    useEffect(() => {

        dispatch(getProducts(currentPage, keyword, price, category, ratings, numOfReviews))
    }, [currentPage, keyword, price, category, ratings, numOfReviews]);

    // page 1 replaces the list, later pages are appended
    useEffect(() => {
        if (loading) {
            return
        }
        if (currentPage === 1) {
            setProductList(products)
        } else {
            setProductList(prevList => [...prevList, ...products])
        }
    }, [products, loading]);

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200
            const hasMore = currentPage * resPerPage < count
            if (nearBottom && hasMore && !loading) {
                setCurrentPage(currentPage + 1)
            }
        }

        window.addEventListener('scroll', handleScroll)
        // also check once, in case the first page is too short to scroll
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [currentPage, resPerPage, count, loading]);

    return (
        <>
            <MetaData title={keyword ? 'Search Results' : 'For Sale Units'} />
            <div className="container container-fluid">
                <section id="products" className="mt-5">
                    {/* <div className="row">
                        {products && products.map(product => (
                            <Product key={product._id} product={product} />
                            // <Product product={product} />


                        ))}
                    </div> */}
                    <div className="row">
                        <div className="col-12 col-md-3 filter-column">
                            <div className="filter-card">
                                <h5 className="filter-card-title">Filter</h5>
                                <label htmlFor="category_filter" className="filter-label">Category</label>
                                <select
                                    id="category_filter"
                                    className="form-control"
                                    value={category}
                                    onChange={(e) => categoryHandler(e.target.value)}
                                >
                                    <option value="">Any category</option>
                                    {motorcycleCategories.map(item => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-card">
                                <button type="button" className="filter-section-header" aria-expanded={priceOpen} onClick={() => setPriceOpen(!priceOpen)}>
                                    <i className={`fa ${priceOpen ? 'fa-chevron-down' : 'fa-chevron-right'}`} aria-hidden="true"></i> Price
                                </button>
                                {priceOpen && (
                                    <div className="filter-section-body">
                                        <div className="d-flex justify-content-between filter-price-values">
                                            <span>{priceLabel(price[0])}</span>
                                            <span>{priceLabel(price[1])}</span>
                                        </div>
                                        <Box sx={{ px: 1 }}>
                                            <Slider
                                                getAriaLabel={() => 'Price Filter'}
                                                value={price}
                                                onChange={handleChange}
                                                valueLabelDisplay="off"
                                                getAriaValueText={valuetext}
                                                min={0}
                                                max={10000}
                                                step={100}
                                                sx={{
                                                    '& .MuiSlider-track': { backgroundColor: '#111111', borderColor: '#111111' },
                                                    '& .MuiSlider-rail': { backgroundColor: '#111111', opacity: 1 },
                                                    '& .MuiSlider-thumb': { backgroundColor: '#ffffff', border: '2px solid #111111' },
                                                    '& .MuiSlider-thumb:hover, & .MuiSlider-thumb.Mui-focusVisible, & .MuiSlider-thumb.Mui-active': { boxShadow: '0 0 0 6px rgba(0, 0, 0, 0.12)' }
                                                }}
                                            />
                                        </Box>
                                    </div>
                                )}

                                <hr className="my-3" />

                                <button type="button" className="filter-section-header" aria-expanded={ratingsOpen} onClick={() => setRatingsOpen(!ratingsOpen)}>
                                    <i className={`fa ${ratingsOpen ? 'fa-chevron-down' : 'fa-chevron-right'}`} aria-hidden="true"></i> Ratings
                                </button>
                                {ratingsOpen && (
                                    <div className="filter-section-body">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="ratings_filter"
                                                id="ratings_filter_0"
                                                checked={ratings === 0}
                                                onChange={() => ratingsHandler(0)}
                                            />
                                            <label className="form-check-label" htmlFor="ratings_filter_0">Any rating</label>
                                        </div>
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <div className="form-check" key={star}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="ratings_filter"
                                                    id={`ratings_filter_${star}`}
                                                    checked={ratings === star}
                                                    onChange={() => ratingsHandler(star)}
                                                />
                                                <label className="form-check-label" htmlFor={`ratings_filter_${star}`}>
                                                    <div className="rating-outer">
                                                        <div className="rating-inner" style={{ width: `${star * 20}%` }}></div>
                                                    </div>
                                                    {star < 5 && <span> & up</span>}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <hr className="my-3" />

                                <button type="button" className="filter-section-header" aria-expanded={reviewsOpen} onClick={() => setReviewsOpen(!reviewsOpen)}>
                                    <i className={`fa ${reviewsOpen ? 'fa-chevron-down' : 'fa-chevron-right'}`} aria-hidden="true"></i> Reviews
                                </button>
                                {reviewsOpen && (
                                    <div className="filter-section-body">
                                        {[0, 1, 5, 10].map(min => (
                                            <div className="form-check" key={min}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="reviews_filter"
                                                    id={`reviews_filter_${min}`}
                                                    checked={numOfReviews === min}
                                                    onChange={() => reviewsHandler(min)}
                                                />
                                                <label className="form-check-label" htmlFor={`reviews_filter_${min}`}>
                                                    {min === 0 ? 'Any' : `${min}+ reviews`}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="filter-card">
                                <h5 className="filter-card-title">Reset</h5>
                                <button type="button" id="clear_filters_btn" className="btn btn-outline-dark btn-block" onClick={clearFiltersHandler}>
                                    Clear all filters
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-md-9">
                            <div className="listing-results">
                                <h2 className="listing-results-count">{filteredProductsCount || 0} results</h2>
                                {keyword && <p className="listing-results-keyword">Results for "{keyword}"</p>}
                            </div>
                            {loading && currentPage === 1 ? <Loader /> : (
                                <div className="row">
                                    {productList.map(product => (
                                        <Product key={product._id} product={product} />
                                    ))}
                                </div>
                            )}
                            {loading === false && productList.length === 0 && products.length === 0 && (
                                <p className="text-center text-muted py-5">No products match your filters.</p>
                            )}
                            {loading && currentPage > 1 && (
                                <p className="text-center mt-3">Loading more...</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home