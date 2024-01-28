const express = require("express");
const multer = require("multer");
const { register, login, logoutUser, changeRole } = require("../Controller/authController");
const { createCategory, getCategory, createProduct, storage, getProducts, getProductById, updateProduct, getImage } = require("../Controller/productController");
const { getUsers, getUserById, updateUser, deleteUser } = require("../Controller/userController");
const { AuthMiddleware } = require("../Middleware/authenticationMiddleware");
const { payAmount, stripePayment } = require("../Controller/paymentController");
const { createOrder, createAddress, getAddress, editStatusOfOrderAndPayment, getOrders } = require("../Controller/orderController");
const upload = multer({ storage: storage });

const router = express.Router();



// auth api 
router.post('/register', register)
router.post("/login", login)
router.delete("/logout", AuthMiddleware, logoutUser)

//product api
router.post("/createCategory", AuthMiddleware, createCategory)
router.get("/getCategory", AuthMiddleware, getCategory)
router.post("/createProduct", AuthMiddleware, upload.single("file"), createProduct)
router.get("/getProduct", getProducts)
router.get("/getAProduct/:id", AuthMiddleware, getProductById)
router.put("/updateProduct/:id", AuthMiddleware, upload.single("file"), updateProduct)
router.delete("/deleteProduct/:id", AuthMiddleware, deleteUser)
router.get("/image/:name", getImage);
router.post("/createOrder", AuthMiddleware, createOrder)
router.post("/createAddress", AuthMiddleware, createAddress)
router.get("/getAddress/:id" , AuthMiddleware , getAddress)
router.put("/editStatus/:id", AuthMiddleware,editStatusOfOrderAndPayment)
router.get("/getOrders",AuthMiddleware,getOrders)

//users api 
router.get("/users", AuthMiddleware, getUsers)
router.get("/getAUser/:id", AuthMiddleware, getUserById)
router.put("/updateUser/:id", AuthMiddleware, updateUser)
router.put("/changeRole/:id",changeRole)
router.delete("/deleteUser/:id", AuthMiddleware, deleteUser)

//payment api
router.post('/payment/:price', payAmount)
router.post('/paymentByStripe', stripePayment)

module.exports = router