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

    function valuetext(price) {
        return `P${price.toString()}`;
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
                <header className="storefront-heading">
                    <h1 id="products_heading">{keyword ? 'Search Results' : 'For Sale Units'}</h1>
                    <p>{keyword ? `Products matching "${keyword}"` : 'Your Next Ride Starts Here.'}</p>
                </header>
                <section id="products" className="container mt-5">
                    {/* <div className="row">
                        {products && products.map(product => (
                            <Product key={product._id} product={product} />
                            // <Product product={product} />


                        ))}
                    </div> */}
                    <div className="row">
                        <div className="col-6 col-md-3 mt-5 mb-5">
                            <Box sx={{ width: 150 }}>
                                <Slider
                                    getAriaLabel={() => 'Price Filter'}
                                    value={price}
                                    onChange={handleChange}
                                    valueLabelDisplay="on"
                                    getAriaValueText={valuetext}
                                    min={0}
                                    max={10000}
                                    step={100}
                                />
                            </Box>
                            <div className="mt-5">
                                <h4 className="mb-3">
                                    Categories
                                </h4>
                                <ul className="pl-0">
                                    <li
                                        style={{ cursor: 'pointer', listStyleType: 'none', fontWeight: category === '' ? 'bold' : 'normal' }}
                                        onClick={() => categoryHandler('')}
                                    >
                                        All
                                    </li>
                                    {motorcycleCategories.map(item => (
                                        <li
                                            key={item}
                                            style={{ cursor: 'pointer', listStyleType: 'none', fontWeight: category === item ? 'bold' : 'normal' }}
                                            onClick={() => categoryHandler(item)}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <hr className="my-3" />

                            <div className="mt-5">
                                <h4 className="mb-3">
                                    Ratings
                                </h4>
                                <ul className="pl-0">
                                    <li
                                        style={{ cursor: 'pointer', listStyleType: 'none', fontWeight: ratings === 0 ? 'bold' : 'normal' }}
                                        onClick={() => ratingsHandler(0)}
                                    >
                                        Any rating
                                    </li>
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <li
                                            key={star}
                                            style={{ cursor: 'pointer', listStyleType: 'none', opacity: ratings === star ? 1 : 0.6 }}
                                            onClick={() => ratingsHandler(star)}
                                        >
                                            <div className="rating-outer">
                                                <div className="rating-inner" style={{ width: `${star * 20}%` }}></div>
                                            </div>
                                            {star < 5 && <span> & up</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <hr className="my-3" />

                            <div className="mt-5">
                                <h4 className="mb-3">
                                    Reviews
                                </h4>
                                <ul className="pl-0">
                                    {[0, 1, 5, 10].map(min => (
                                        <li
                                            key={min}
                                            style={{ cursor: 'pointer', listStyleType: 'none', fontWeight: numOfReviews === min ? 'bold' : 'normal' }}
                                            onClick={() => reviewsHandler(min)}
                                        >
                                            {min === 0 ? 'Any' : `${min}+ reviews`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-6 col-md-9">
                            {loading && currentPage === 1 ? <Loader /> : (
                                <div className="row">
                                    {productList.map(product => (
                                        <Product key={product._id} product={product} />
                                    ))}
                                </div>
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