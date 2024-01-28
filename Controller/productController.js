const categoryModal = require("../Modal/categoryModal");
const productSchema = require("../Modal/productModal")
const { Roles } = require('../utils/constant');
const mongoDB = require("../database/connection");
const path = require("path");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./data");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});


const createCategory = async (req, res) => {

    if (req.role == Roles.Admin) {
        try {

            const category = new categoryModal({
                categoryName: req.body.name,
                createdAt: Date.now()
            })

            await category.save();
            console.log(category)
            res.send(category)

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    else {
        res.status(401).send("Unauthorized");
    }

}


const createProduct = async (req, res) => {
    if (req.role != Roles.Admin) {
        res.status(401).send("Unauthorized");
        return;
    }
    let product = await productSchema.find({ title: req.body.productTitle })

    if (product.length != 0) {
        res.status(400).send("Product  Already exsist ")
    }
    else {
        try {
            filename = req.file.filename;
            const product = new productSchema({
                title: req.body.productTitle,
                description: req.body.productDescription,
                price: req.body.productPrice,
                quantity: req.body.productQuantity,
                image: filename,
                createdAt: Date.now(),
                categoryId: req.body.category_id,
            });
            await product.save().then(() => {
                res.send(product);
                console.log('Product saved successfully!');
            })
                .catch((error) => {
                    res.send(error)
                    console.error('Error saving product:', error);
                });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
}

const getCategory = async (req, res) => {

    const category = await categoryModal.find({})
    res.send(category)

}

const getProducts = async (req, res) => {

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const char = req.query.char;
    const id = req.query.categoryId || "";
    const sellerId = req.query.sellerId || "";
    try {

        if(req.role === Roles.SELLER)
        {
            const product = await productSchema.find({userId : sellerId}).populate({
                path: 'categoryId',
                model: 'category',
                select: 'categoryName'
            }).exec();

            res.send()
            return
        }
        let query = {};
        if (char) {
            query.title = { $regex: new RegExp(char, 'i') }; // Case-insensitive name search
        }

        if (id.length !=0 ) {
            query.categoryId = id;
        }
        const orders = await productSchema.find(query).populate({
            path: 'categoryId',
            model: 'category',
            select: 'categoryName'
        }).exec();

        // const orders = await productSchema.aggregate([
        //     {
        //         $lookup: {
        //             from: 'categories', // Assuming the name of the category collection is 'categories'
        //             localField: 'categoryId',
        //             foreignField: '_id',
        //             as: 'categoryDetails'
        //         }
        //     },
        //     {
        //         $unwind: '$categoryDetails'
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             title: 1,
        //             description: 1,
        //             price: 1,
        //             quantity: 1,
        //             image: 1,
        //             createdAt: 1,
        //             categoryId: `$categoryId`, // Keep the original categoryId field if needed
        //             categoryName: `$categoryDetails.categoryName`,
        //             category_id: `$categoryDetails._id`
        //         }
        //     }
        // ]);
        const paginatedResults = orders.slice(skip, skip + limit);

        res.send({
            result: paginatedResults,
            count: orders.length,
        });
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await productSchema.findById(id);
        res.status(200).send(product);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
const updateProduct = async (req, res) => {


    if (req.role != Roles.Admin) {
        res.status(401).send("Unauthorized");
        return;
    }
    const product_id = req.params.id;

    try {
        const product = await productSchema.findByIdAndUpdate(product_id, {
            title: req.body.productTitle,
            description: req.body.productDescription,
            price: req.body.productPrice,
            quantity: req.body.productQuantity,
            categoryId: req.body.category_id
        }, {
            new: true,
            runValidators: true
        },);
        if (req.file) {
            const filename = req.file.filename;
            product.image = filename;
            await product.save();
        }

        const updatedProduct = await productSchema.findById(product_id)
        res.status(200).send({
            data: updatedProduct,
            message: "Product updated  Sucessfully"
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }

}
const deleteProduct = async (req, res) => {
    if (req.role != Roles.Admin) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.params.id;

    try {
        const product = await productSchema.findByIdAndDelete(userId);
        res.status(200).send(`User deleted is ${userId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
const getImage = (req, res) => {
    const name = req.params.name;
    res.sendFile(path.join(__dirname, "../data", name));
};

module.exports = { createCategory, getCategory, createProduct, storage, getProducts, getProductById, deleteProduct, updateProduct , getImage}

