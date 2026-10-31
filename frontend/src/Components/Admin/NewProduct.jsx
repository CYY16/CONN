import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { newProduct, clearErrors } from '../../actions/productActions'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'
import { motorcycleBrands, motorcycleCategories } from '../../constants/productOptions'

const NewProduct = () => {
    const dispatch = useDispatch()
    const { loading, error, success } = useSelector(state => state.newProduct)

    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: '',
            price: 0,
            description: '',
            category: '',
            stock: 0,
            seller: ''
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
            if (images.length === 0) {
                return
            }

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

            dispatch(newProduct(formData))
        }
    })

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([])
        setImages([])
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
        if (error) {
            toast.error(error, { position: 'bottom-right' });
            dispatch(clearErrors())
        }

        if (success) {
            navigate('/admin/products');
            toast.success('Product created successfully', { position: 'bottom-right' })
            dispatch({ type: NEW_PRODUCT_RESET })
        }
    }, [error, dispatch, navigate, success])

    return (
        <>
            <MetaData title={'New Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                        <form className="shadow-lg" onSubmit={formik.handleSubmit} encType='multipart/form-data' noValidate>
                            <h1 className="mb-4">New Product</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input type="text" id="name_field" className="form-control" {...formik.getFieldProps('name')} />
                                {formik.touched.name && formik.errors.name && (
                                    <small className="text-danger">{formik.errors.name}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Price</label>
                                <input type="text" id="price_field" className="form-control" {...formik.getFieldProps('price')} />
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
                                    <option value="" disabled>Select a motorcycle category</option>
                                    {motorcycleCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <small className="text-danger">{formik.errors.category}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input type="number" id="stock_field" className="form-control" {...formik.getFieldProps('stock')} />
                                {formik.touched.stock && formik.errors.stock && (
                                    <small className="text-danger">{formik.errors.stock}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="seller_field">Brand Name</label>
                                <select id="seller_field" className="form-control" {...formik.getFieldProps('seller')} required>
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
                                    <input type='file' id='customFile' className='custom-file-input' multiple onChange={onChange} />
                                    <label className='custom-file-label' htmlFor='customFile'>Choose Images</label>
                                </div>
                                {formik.submitCount > 0 && images.length === 0 && (
                                    <small className="text-danger">Please upload at least one image</small>
                                )}
                                <div className='mt-3 row'>
                                    {imagesPreview.map((image, index) => (
                                        <div key={index} className='col-md-3 mb-2'>
                                            <img src={image} alt='Preview' className='img-thumbnail' />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button id="login_button" type="submit" className="btn btn-block py-3" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm mr-2"></span>Creating...</>
                                ) : 'CREATE'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewProduct
