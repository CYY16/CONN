const Order = require('../models/order');
const Product = require('../models/product');
const sendEmail = require('../utils/sendEmail');
const PDFDocument = require('pdfkit');



// Create a new order   =>  /api/v1/order/new
exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
}

exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
    // console.log(req.user)
    res.status(200).json({
        success: true,
        orders
    })
}

exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
        res.status(404).json({
            message: 'No Order found with this ID',

        })
    }
    res.status(200).json({
        success: true,
        order
    })
}

exports.allOrders = async (req, res, next) => {
    const orders = await Order.find()
    // console.log(orders)
    let totalAmount = 0;

    orders.forEach(order => {

        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}

exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
        return res.status(400).json({
            message: 'No Order found with this ID',

        })

    }
    return res.status(200).json({
        success: true
    })
}

exports.updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    console.log(req.body.order)
    if (order.orderStatus === 'Delivered') {
        return res.status(400).json({
            message: 'You have already delivered this order',

        })
    }

    if (req.body.status === 'Delivered') {
        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.quantity)
        })
    }

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    await order.save()

    await order.populate('user', 'name email')

    let rows = ''
    order.orderItems.forEach(item => {
        rows += `<tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>&#8369;${Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>&#8369;${Number(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
    })

    const html = `<p>Hi ${order.user.name},</p>
        <p>Your order <b>${order._id}</b> is now: <b>${order.orderStatus}</b></p>
        <table border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
            </tr>
            ${rows}
        </table>
        <p>Items: &#8369;${Number(order.itemsPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Shipping: &#8369;${Number(order.shippingPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Tax: &#8369;${Number(order.taxPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><b>Grand Total: &#8369;${Number(order.totalPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></p>
        <p>Your receipt is attached as a PDF.</p>`

    const doc = new PDFDocument()
    doc.fontSize(18).text('Order Receipt')
    doc.fontSize(12).text(`Order ID: ${order._id}`)
    doc.text(`Customer: ${order.user.name}`)
    doc.text(`Status: ${order.orderStatus}`)
    doc.moveDown()
    order.orderItems.forEach(item => {
        doc.text(`${item.name} - ${item.quantity} x PHP ${Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = PHP ${Number(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    })
    doc.moveDown()
    doc.text(`Items: PHP ${Number(order.itemsPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    doc.text(`Shipping: PHP ${Number(order.shippingPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    doc.text(`Tax: PHP ${Number(order.taxPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    doc.text(`Grand Total: PHP ${Number(order.totalPrice).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    doc.end()

    try {
        await sendEmail({
            email: order.user.email,
            subject: `Order ${order._id} - ${order.orderStatus}`,
            html,
            attachments: [
                {
                    filename: `receipt-${order._id}.pdf`,
                    content: doc
                }
            ]
        })
    } catch (error) {
        console.log(error)
    }

    res.status(200).json({
        success: true,
    })
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false })
}

exports.totalOrders = async (req, res, next) => {
    const totalOrders = await Order.aggregate([
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ])
    if (!totalOrders) {
        return res.status(404).json({
            message: 'error total orders',
        })
    }
    res.status(200).json({
        success: true,
        totalOrders
    })

}

exports.totalSales = async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$totalPrice" }
            }
        }
    ])
    if (!totalSales) {
        return res.status(404).json({
            message: 'error total sales',
        })
    }
    res.status(200).json({
        success: true,
        totalSales
    })
}

exports.customerSales = async (req, res, next) => {
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

    const pipeline = [
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            },
        },
        // {
        //     $group: {
        //         _id: "$user",
        //         total: { $sum: "$totalPrice" },
        //     }
        // },

        { $unwind: "$userDetails" },
        {
            $group: {
                _id: "$user",
                total: { $sum: "$totalPrice" },
                doc: { "$first": "$$ROOT" },

            }
        },

        {
            $replaceRoot: {
                newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
            },
        },
        // {
        //     $group: {
        //         _id: "$userDetails.name",
        //         total: { $sum: "$totalPrice" }
        //     }
        // },
        {
            $project: {
                _id: 0,
                "userDetails.name": true,
                total: true,
            }
        },
        { $sort: { total: 1 } },

    ]
    if (dateMatch) {
        pipeline.unshift({ $match: dateMatch });
    }
    const customerSales = await Order.aggregate(pipeline)
    console.log(customerSales)
    if (!customerSales) {
        return res.status(404).json({
            message: 'error customer sales',
        })


    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        customerSales
    })

}

exports.salesPerMonth = async (req, res, next) => {
    // select monthname(paidAt) sum(price * quantity)
    // from orders
    // group by month(date_placed), year(date_placed)
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

    const pipeline = [

        {
            $group: {
                // _id: {month: { $month: "$paidAt" } },
                _id: {
                    year: { $year: "$paidAt" },
                    month: { $month: "$paidAt" }
                },
                total: { $sum: "$totalPrice" },
            },
        },

        {
            $addFields: {
                month: {
                    $let: {
                        vars: {
                            monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        },
                        in: {
                            $arrayElemAt: ['$$monthsInString', "$_id.month"]
                        }
                    }
                }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: true,
                total: true,
            }
        }

    ]
    if (dateMatch) {
        pipeline.unshift({ $match: dateMatch });
    }
    const salesPerMonth = await Order.aggregate(pipeline)
    if (!salesPerMonth) {
        return res.status(404).json({
            message: 'error sales per month',
        })
    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        salesPerMonth
    })

}