import React, { useState, useEffect } from 'react'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
// import axios from 'axios';
// import { getToken } from '../Utils/helpers';
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { updateProduct, getProductDetails, clearErrors } from '../../actions/productActions'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'
import { motorcycleBrands, motorcycleCategories } from '../../constants/productOptions'


const UpdateProduct = () => {
    const dispatch = useDispatch()
    const { error, product } = useSelector(state => state.productDetails);
    const { loading, error: updateError, isUpdated } = useSelector(state => state.product);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    // const [error, setError] = useState('')
    // const [product, setProduct] = useState({})
    // const [loading, setLoading] = useState(true)
    // const [updateError, setUpdateError] = useState('')
    // const [isUpdated, setIsUpdated] = useState(false)

    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: 'bottom-right'
    });
    const successMsg = (message = '') => toast.success(message, {
        position: 'bottom-right'
    });

    // const getProductDetails = async (id) => {
    //     try {
    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
    //         setProduct(data.product)
    //         setLoading(false)

    //     } catch (error) {
    //         setError(error.response.data.message)

    //     }
    // }

    // const updateProduct = async (id, productData) => {
    //     try {

    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/product/${id}`, productData, config)
    //         setIsUpdated(data.success)

    //     } catch (error) {
    //         setUpdateError(error.response.data.message)

    //     }
    // }
    // useEffect(() => {
    //     if (product && product._id !== id) {
    //         getProductDetails(id)
    //     } else {
    //         setName(product.name);
    //         setPrice(product.price);
    //         setDescription(product.description);
    //         setCategory(product.category);
    //         setSeller(product.seller);
    //         setStock(product.stock)
    //         setOldImages(product.images)
    //     }
    //     if (error) {
    //         errMsg(error)

    //     }
    //     if (updateError) {
    //         errMsg(updateError);

    //     }
    //     if (isUpdated) {
    //         navigate('/admin/products');
    //         successMsg('Product updated successfully');

    //     }
    // }, [error, isUpdated, updateError, product, id])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: product.name || '',
            price: product.price || 0,
            description: product.description || '',
            category: product.category || '',
            stock: product.stock || 0,
            seller: product.seller || ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .trim()
                .max(100, 'Name cannot exceed 100 characters')
                .required('Name is required'),
            price: Yup.number()
                .typeError('Price must be a number')
                .moreThan(0, 'Price must be greater than 0')
                .required('Price is required'),
            description: Yup.string()
                .trim()
                .required('Description is required'),
            category: Yup.string()
                .required('Category is required'),
            stock: Yup.number()
                .typeError('Stock must be a number')
                .integer('Stock must be a whole number')
                .min(0, 'Stock cannot be negative')
                .required('Stock is required'),
            seller: Yup.string()
                .required('Brand is required')
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('price', values.price);
            formData.set('description', values.description);
            formData.set('category', values.category);
            formData.set('stock', values.stock);
            formData.set('seller', values.seller);
            images.forEach(image => {
                formData.append('images', image)
            })
            dispatch(updateProduct(product._id, formData))
        }
    })

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    useEffect(() => {
        if (product && product._id !== id) {
            dispatch(getProductDetails(id))
        } else {
            setOldImages(product.images)
        }
        if (error) {
            errMsg(error)
            dispatch(clearErrors())

        }
        if (updateError) {
            errMsg(updateError);
            dispatch(clearErrors())

        }
        if (isUpdated) {
            navigate('/admin/products');
            successMsg('Product updated successfully');
            dispatch({ type: UPDATE_PRODUCT_RESET })

        }
    }, [error, updateError, product, id, isUpdated])
    return (
        <>
            <MetaData title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={formik.handleSubmit} encType='multipart/form-data' noValidate>
                                <h1 className="mb-4">Update Product</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <small className="text-danger">{formik.errors.name}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        {...formik.getFieldProps('price')}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <small className="text-danger">{formik.errors.price}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea className="form-control" id="description_field" rows="8" {...formik.getFieldProps('description')}></textarea>
                                    {formik.touched.description && formik.errors.description && (
                                        <small className="text-danger">{formik.errors.description}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select className="form-control" id="category_field" {...formik.getFieldProps('category')} required>
                                        {formik.values.category && !motorcycleCategories.includes(formik.values.category) && (
                                            <option key={formik.values.category} value={formik.values.category}>{formik.values.category} (legacy category)</option>
                                        )}
                                        {motorcycleCategories.map(category => (
                                            <option key={category} value={category} >{category}</option>
                                        ))}
                                    </select>
                                    {formik.touched.category && formik.errors.category && (
                                        <small className="text-danger">{formik.errors.category}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        {...formik.getFieldProps('stock')}
                                    />
                                    {formik.touched.stock && formik.errors.stock && (
                                        <small className="text-danger">{formik.errors.stock}</small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="seller_field">Brand Name</label>
                                    <select
                                        id="seller_field"
                                        className="form-control"
                                        {...formik.getFieldProps('seller')}
                                        required
                                    >
                                        {formik.values.seller && !motorcycleBrands.includes(formik.values.seller) && (
                                            <option key={formik.values.seller} value={formik.values.seller}>{formik.values.seller} (existing brand)</option>
                                        )}
                                        <option value="" disabled>Select a brand</option>
                                        {motorcycleBrands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                    {formik.touched.seller && formik.errors.seller && (
                                        <small className="text-danger">{formik.errors.seller}</small>
                                    )}
                                </div>
                                <div className='form-group'>
                                    <label>Images</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                        </label>
                                    </div>
                                    {oldImages && oldImages.map(img => (
                                        <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                </div>
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm mr-2"></span>Updating...</>
                                    ) : 'UPDATE'}
                                </button>
                            </form>
                        </div>
                    </>
                </div>
            </div>
        </>
    )
}

export default UpdateProduct