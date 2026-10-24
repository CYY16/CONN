import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { newProduct, clearErrors } from '../../actions/productActions'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'
import { motorcycleBrands, motorcycleCategories } from '../../constants/productOptions'

const NewProduct = () => {
    const dispatch = useDispatch()
    const { loading, error, success } = useSelector(state => state.newProduct)

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])

    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('category', category);
        formData.set('stock', stock);
        formData.set('seller', seller);

        images.forEach(image => {
            formData.append('images', image)
        })

        dispatch(newProduct(formData))
    }

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
                        <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                            <h1 className="mb-4">New Product</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input type="text" id="name_field" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Price</label>
                                <input type="text" id="price_field" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Description</label>
                                <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category_field">Category</label>
                                <select className="form-control" id="category_field" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="" disabled>Select a motorcycle category</option>
                                    {motorcycleCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input type="number" id="stock_field" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="seller_field">Brand Name</label>
                                <select id="seller_field" className="form-control" value={seller} onChange={(e) => setSeller(e.target.value)} required>
                                    <option value="" disabled>Select a brand</option>
                                    {motorcycleBrands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Images</label>
                                <div className='custom-file'>
                                    <input type='file' id='customFile' className='custom-file-input' multiple onChange={onChange} />
                                    <label className='custom-file-label' htmlFor='customFile'>Choose Images</label>
                                </div>
                                <div className='mt-3 row'>
                                    {imagesPreview.map((image, index) => (
                                        <div key={index} className='col-md-3 mb-2'>
                                            <img src={image} alt='Preview' className='img-thumbnail' />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button id="login_button" type="submit" className="btn btn-block py-3" disabled={loading}>
                                CREATE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewProduct
