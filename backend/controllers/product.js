const Product = require('../models/product')
const Order = require('../models/order')
const cloudinary = require('cloudinary')
const APIFeatures = require('../utils/apiFeatures');
const Filter = require('bad-words');

exports.newProduct = async (req, res, next) => {
    console.log(req.files)
    let images = []
    // if (typeof req.files === 'string') {
    //     images.push(req.files)
    // } else {
    //     images = req.files
    // }

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        try {
            // const result = await cloudinary.v2.uploader.upload(images[i].path, {
            const result = await cloudinary.v2.uploader.upload(images[i], {

                folder: 'products',
                width: 150,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        } catch (error) {
            console.log(error)
        }

    }

    req.body.images = imagesLinks
    // req.body.user = req.user.id;

    const product = await Product.create(req.body);

    if (!product)
        return res.status(400).json({
            success: false,
            message: 'Product not created'
        })


    return res.status(201).json({
        success: true,
        product
    })
}

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    return res.status(200).json({
        success: true,
        product
    })
}

exports.getProducts = async (req, res) => {

    const resPerPage = 4;
    const productsCount = await Product.countDocuments();

    // const products = await Product.find()
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter()
    // .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query.clone();
    // const products = await apiFeatures.query;

    if (!products)
        return res.status(400).json({ message: 'error loading products' })
    return res.status(200).json({
        success: true,
        products,
        filteredProductsCount,
        resPerPage,
        productsCount,

    })
    // if (!products)
    //     return res.status(400).json({ message: 'error loading products' })

    // return res.status(200).json({
    //     success: true,
    //     products,
    //     resPerPage,
    //     productsCount,

    // })
}

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    console.log(req.body)
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    let images = []

    // if (typeof req.files === 'string') {
    //     images.push(req.files)
    // } else {
    //     images = req.files
    // }
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    // console.log(images)

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products',
            width: 150,
            crop: "scale",
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })

    }
    req.body.images = imagesLinks
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })
    // console.log(product)
    return res.status(200).json({
        success: true,
        product
    })
}

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Product deleted'
    })
}

exports.deleteProducts = async (req, res, next) => {
    await Product.deleteMany({ _id: { $in: req.body.ids } });

    return res.status(200).json({
        success: true
    })
}

exports.getAdminProducts = async (req, res, next) => {

    const products = await Product.find();
    if (!products) {
        return res.status(404).json({
            success: false,
            message: 'Products not found'
        })
    }
    return res.status(200).json({
        success: true,
        products
    })

}

exports.createProductReview = async (req, res, next) => {
    const { rating, productId } = req.body;
    let comment = req.body.comment;
    const filter = new Filter();
    // bad-words v3 clean() throws on strings with no word characters (e.g. '' or '!!!')
    if (comment && /\w/.test(comment)) {
        comment = filter.clean(comment);
    }
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const order = await Order.findOne({ user: req.user._id, 'orderItems.product': productId })
    if (!order) {
        return res.status(400).json({
            message: 'Only customers who ordered this product can review it'
        })
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
    await product.save({ validateBeforeSave: false });
    if (!product)
        return res.status(400).json({
            success: false,
            message: 'review not posted'
        })
    return res.status(200).json({
        success: true
    })
}

exports.getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}

exports.deleteReview = async (req, res, next) => {
    console.log(req.query)
    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;

    let ratings = 0
    if (reviews.length > 0) {
        ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    }

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    return res.status(200).json({
        success: true
    })
}

exports.productSales = async (req, res, next) => {
    const { startDate, endDate } = req.query;
    let dateMatch = null;
    if (startDate || endDate) {
        dateMatch = { paidAt: {} };
        if (startDate) {
            dateMatch.paidAt.$gte = new Date(`${startDate}T00:00:00`);
        }
        if (endDate) {
            dateMatch.paidAt.$lte = new Date(`${endDate}T23:59:59.999`);
        }
    }

    const totalSalesPipeline = [
        {
            $group: {
                _id: null,
                total: { $sum: "$itemsPrice" }

            },

        },
    ]
    if (dateMatch) {
        totalSalesPipeline.unshift({ $match: dateMatch });
    }
    const totalSales = await Order.aggregate(totalSalesPipeline)
    console.log(totalSales)

    const salesPipeline = [
        { $project: { _id: 0, "orderItems": 1, totalPrice: true } },
        { $unwind: "$orderItems" },

        {
            $group: {
                _id: { product: "$orderItems.name" },
                total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            },
        },
    ]
    if (dateMatch) {
        salesPipeline.unshift({ $match: dateMatch });
    }
    const sales = await Order.aggregate(salesPipeline)
    console.log(sales)

    // no orders in the date range: totalSales is [] and totalSales[0].total below would crash
    if (totalSales.length === 0) {
        return res.status(200).json({
            success: true,
            totalPercentage: [],
            sales,
            totalSales
        })
    }

    if (!totalSales) {
        return res.status(404).json({
            message: 'error sales'
        })

    }
    if (!sales) {
        return res.status(404).json({
            message: 'error sales'
        })

    }

    let totalPercentage = {}
    totalPercentage = sales.map(item => {

        // console.log( ((item.total/totalSales[0].total) * 100).toFixed(2))
        percent = Number(((item.total / totalSales[0].total) * 100).toFixed(2))
        total = {
            name: item._id.product,
            percent
        }
        return total
    })
    console.log(totalPercentage)
    res.status(200).json({
        success: true,
        totalPercentage,
        sales,
        totalSales
    })

}