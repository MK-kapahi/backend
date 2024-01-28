const orderModal = require("../Modal/orderModal");
const shippingAddress = require("../Modal/shippingAddress");
const userModal = require("../Modal/userModal");
const { STATUS_CODES, Roles } = require("../utils/constant");
const { updateProduct } = require("./productController");


const getUsers = async (req, res) => {

  const char = req.query.char;
  if (req.role == Roles.Admin) {
    try {
      let query = {};
      if (char) {
        query.name = { $regex: new RegExp(char, 'i') }; // Case-insensitive name search
      }
      const users = await userModal.find(query).exec();
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  else if (req.role == Roles.User) {
    try {

      console.log(req.userId)
      const users = await userModal.find({ _id: req.userId });
      res.status(STATUS_CODES.HTTP_OK).send(users);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  else {
    res.status(401).send("Unauthorized");
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await userModal.findById(id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const updateUser = async (req, res) => {
  if (req.role != Roles.Admin) {
    res.status(401).send("Unauthorized");
    return;
  }
  const userId = req.params.id;

  try {
    const user = await userModal.findByIdAndUpdate(userId, {
      name: req.body.name,
      email: req.body.email
    });
    const updatedUser = await userModal.findById(userId);
    res.status(200).send({
      user: updatedUser,
      message: "User Updated Sucessfully"
    }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
    });
  }
};

const deleteUser = async (req, res) => {
  if (req.role != Roles.Admin) {
    res.status(401).send("Unauthorized");
    return;
  }
  const userId = req.params.id;

  try {
    const user = await userModal.findByIdAndDelete(userId);
    res.status(200).send(`User deleted is ${userId}`);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// const createOrder = async (req, res) => {
//   if (req.role != Roles.User) {
//     res.status(401).send("Unauthorized");
//     return;
//   }
//   try {

//     const existingOrder = await orderModal.findOne({ userId: req.body.userId });
//     if (existingOrder) {
//       // If the order already exists, update the product array
//       const existingProduct = req.body.product.some((newProduct) =>
//         existingOrder.product.some((existingProduct) => existingProduct._id === newProduct._id)
//       );
//       if (existingProduct) {
//         existingOrder.product.forEach((existingProduct) => {
//           const matchingNewProduct = req.body.product.find((newProduct) => existingProduct._id === newProduct._id);
//           if (matchingNewProduct) {
//            existingProduct.quantity = existingProduct.quantity+ 1;
//           }
//         });
//       }

//       else {
//         existingOrder.product.push(
//           ...req.body.product,
//         );
//       }

//       // Update other fields if needed
//       existingOrder.updatedAt = Date.now();
//       existingOrder.orderStatus = "inProgress";
//       existingOrder.paymentStatus = "inComplete";

//       // Save the updated order
//       const updatedOrder = await existingOrder.save();
//       res.send(updatedOrder);
//     } else {
//       const order = await orderModal({
//         product: req.body.product,
//         userId: req.body.userId,
//         orderStatus: "inProgress",
//         paymentStatus: "inComplete",
//         createdAt: Date.now(),
//         updatedAt: Date.now(),
//       })

//       await order.save()
//       res.send(order)
//     }
//   } catch (error) {
//     console.log(error)
//     res.send(error)
//   }

// }

// const createAddress = async (req, res) => {

//   if (req.role != Roles.User) {
//     res.status(401).send("Unauthorized");
//     return;
//   }

//   try {

//     // const findAddress = await shippingAddress.find({ userId: req.body.userId })
//     // if (findAddress) {
//     //   return
//     // }
//     const address = await shippingAddress({
//       city: req.body.address.City,
//       country: req.body.address.Country,
//       line1: req.body.address.Line2,
//       line2: req.body.address.Line1,
//       postalCode: req.body.address.PostalCode,
//       state: req.body.address.State,
//       userId: req.body.userId,
//       createdAt: Date.now(),
//     })

//     await address.save().then((response) => {
//       console.log(response)
//       res.status(STATUS_CODES.HTTP_OK).send(address)
//     }).catch((error) => {
//       res.send(error)
//     });
//   } catch (error) {
//     console.log(error)
//     res.send(error)
//   }

// }


// const getAddress = async (req, res) => {
//   if (req.role != Roles.User) {
//     res.status(401).send("Unauthorized");
//     return;
//   }
//   try {
//     // console.log(req.params.id)
//     const findAddress = await shippingAddress.find({ userId: req.params.id })
//     res.status(STATUS_CODES.HTTP_OK).send(...findAddress)
//   } catch (error) {
//     res.send(error)
//   }

// }

// const editStatusOfOrderAndPayment = async (req, res) => {

//   const orderId = req.params.id;
//   try {

//     if (req?.body?.orderStatus) {
//       const findOrderAndUpdate = await orderModal.findByIdAndUpdate(orderId, {
//         orderStatus: "Order Cancelled",
//         paymentStatus: "payment cancelled"
//       })
//       // findOrderAndUpdate.product = findOrderAndUpdate.product.map(element => {
//       //   console.log("-------------------------------------------",element)
//       //   if (element.quantity === 1) {
//       //     // If quantity is 1, remove this element
//       //     return null;
//       //   } else {
//       //     // For quantities greater than 1, decrease quantity by 1
//       //     element.quantity -= 1;
//       //     return element;
//       //   }
//       // }).filter(Boolean); // Remove null values (elements with quantity 1)

//       // // Optionally, you can update the document with the modified product array
//       // await findOrderAndUpdate.save();
//       const updatedOrder =  await orderModal.findById(orderId)
//       res.send(updatedOrder)
//     }
//   } catch (error) {
//     res.send(error)
//   }
// }





module.exports = { getUsers, getUserById, updateUser, deleteUser }