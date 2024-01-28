const orderModal = require("../Modal/orderModal");
const shippingAddress = require("../Modal/shippingAddress");
const { Roles } = require("../utils/constant");

const createOrder = async (req, res) => {
    if (req.role != Roles.User) {
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        // Update other fields if needed
        const order = await orderModal({
            product: req.body.product,
            userId: req.body.userId,
            orderStatus: "inProgress",
            paymentStatus: "inComplete",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        await order.save()
        res.send(order)

    } catch (error) {
        console.log(error)
        res.send(error)
    }

}

const createAddress = async (req, res) => {

    if (req.role != Roles.User) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {

        // const findAddress = await shippingAddress.find({ userId: req.body.userId })
        // if (findAddress) {
        //   return
        // }
        const address = await shippingAddress({
            city: req.body.address.City,
            country: req.body.address.Country,
            line1: req.body.address.Line2,
            line2: req.body.address.Line1,
            postalCode: req.body.address.PostalCode,
            state: req.body.address.State,
            userId: req.body.userId,
            createdAt: Date.now(),
        })

        await address.save().then((response) => {
            console.log(response)
            res.status(STATUS_CODES.HTTP_OK).send(address)
        }).catch((error) => {
            res.send(error)
        });
    } catch (error) {
        console.log(error)
        res.send(error)
    }

}


const getAddress = async (req, res) => {
    if (req.role != Roles.User) {
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        console.log(req.params.id)
        const findAddress = await shippingAddress.find({ userId: req.params.id })
        res.send(...findAddress)
        // res.status(STATUS_CODES.HTTP_OK).send(findAddress)
    } catch (error) {
        res.send(error)
    }

}

const editStatusOfOrderAndPayment = async (req, res) => {

    const orderId = req.params.id;
    try {

        if (req?.body?.orderStatus) {
            const findOrderAndUpdate = await orderModal.findByIdAndUpdate(orderId, {
                orderStatus: "Order Cancelled",
                paymentStatus: "payment cancelled"
            })
            // findOrderAndUpdate.product = findOrderAndUpdate.product.map(element => {
            //   console.log("-------------------------------------------",element)
            //   if (element.quantity === 1) {
            //     // If quantity is 1, remove this element
            //     return null;
            //   } else {
            //     // For quantities greater than 1, decrease quantity by 1
            //     element.quantity -= 1;
            //     return element;
            //   }
            // }).filter(Boolean); // Remove null values (elements with quantity 1)

            // // Optionally, you can update the document with the modified product array
            // await findOrderAndUpdate.save();
            const updatedOrder = await orderModal.findById(orderId)
            res.send(updatedOrder)
        }
        else {
            const findOrderAndUpdate = await orderModal.findByIdAndUpdate(orderId, {
                orderStatus: "Order Placed",
                paymentStatus: "payment Sucessfull"
            })
            const updatedOrder = await orderModal.findById(orderId)
            res.send(updatedOrder)
        }
    } catch (error) {
        res.send(error)
    }
}


const getOrders = async (req, res) => {
    try {
        if (req.role == Roles.Admin) {

            const orders = await orderModal.find().populate({
                path: 'userId',
                model: 'Users',
                select: 'name'
            });

            res.send(orders)
        }

        if (req.role == Roles.User) {
            const orders = await orderModal.find({ userId: req.user_Id }).populate({
                path: 'userId',
                model: 'Users',
                select: 'name'
            });

            res.send(orders)
        }
    } catch (error) {
        res.send(error)
    }


}




module.exports = { createOrder, createAddress, getAddress, editStatusOfOrderAndPayment, getOrders }