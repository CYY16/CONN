import React from 'react'
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { countries } from 'countries-list'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartActions'

const Shipping = () => {
    const dispatch = useDispatch();
    const { shippingInfo } = useSelector(state => state.cart)

    const countriesList = Object.values(countries)
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            address: shippingInfo.address || '',
            city: shippingInfo.city || '',
            postalCode: shippingInfo.postalCode || '',
            phoneNo: shippingInfo.phoneNo || '',
            country: shippingInfo.country || ''
        },
        validationSchema: Yup.object({
            address: Yup.string()
                .trim()
                .required('Address is required'),
            city: Yup.string()
                .trim()
                .required('City is required'),
            postalCode: Yup.string()
                .matches(/^\d{4}$/, 'Postal code must be exactly 4 digits')
                .required('Postal code is required'),
            phoneNo: Yup.string()
                .matches(/^09\d{9}$/, 'Enter a valid number, e.g. 09171234567')
                .required('Phone number is required'),
            country: Yup.string()
                .required('Country is required')
        }),
        onSubmit: (values) => {
            dispatch(saveShippingInfo({
                address: values.address,
                city: values.city,
                phoneNo: values.phoneNo,
                postalCode: values.postalCode,
                country: values.country
            }))
            navigate('/confirm')
        }
    })

    return (
        <>
            <MetaData title={'Shipping Info'} />
            <CheckoutSteps shipping />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form
                        className="shadow-lg"
                        onSubmit={formik.handleSubmit}
                        noValidate
                    >
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                {...formik.getFieldProps('address')}
                                required
                            />
                            {formik.touched.address && formik.errors.address && (
                                <small className="text-danger">{formik.errors.address}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                {...formik.getFieldProps('city')}
                                required
                            />
                            {formik.touched.city && formik.errors.city && (
                                <small className="text-danger">{formik.errors.city}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                {...formik.getFieldProps('phoneNo')}
                                required
                            />
                            {formik.touched.phoneNo && formik.errors.phoneNo && (
                                <small className="text-danger">{formik.errors.phoneNo}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="text"
                                id="postal_code_field"
                                className="form-control"
                                {...formik.getFieldProps('postalCode')}
                                required
                            />
                            {formik.touched.postalCode && formik.errors.postalCode && (
                                <small className="text-danger">{formik.errors.postalCode}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                {...formik.getFieldProps('country')}
                                required
                            >
                                <option value="" disabled>Select a country</option>
                                {countriesList.map(country => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}

                            </select>
                            {formik.touched.country && formik.errors.country && (
                                <small className="text-danger">{formik.errors.country}</small>
                            )}
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Shipping
