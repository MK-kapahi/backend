const userModal = require("../Modal/userModal");
const Users = require("../Modal/userModal")
const { creatingHashedPass } = require("../utils/commonFunction");
const { STATUS_CODES, Roles } = require("../utils/constant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {

    const user = await Users.find({});
    const checkUserId = await Users.findOne({ email: req.body.email });

    if (checkUserId) {
        return res.status(409).send({ message: "userid already exists" });
    }
    const hashPass = await creatingHashedPass(req, res)

    try {


        if (user.length === 0) {
            const newUser = new Users({
                name: req.body.name,
                email: req.body.email,
                password: hashPass,
                role: 1
            });
            await newUser.save();
            console.log(newUser)
            res.send(newUser);
        }
        else {
            const newUser = new Users({
                name: req.body.name,
                email: req.body.email,
                password: hashPass,
                role: Roles.NO_ROLE
            });
            await newUser.save();
            console.log(newUser)
            res.status(STATUS_CODES.HTTP_OK).send(newUser);
        }
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }

}

const login = async (req, res) => {
    console.log(req.body)
    const emailId = req.body.email;
    const userPassword = req.body.password;
    try {
        const user = await Users.findOne({ email: emailId });

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(userPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Incorrect password" });
        }

        const token = jwt.sign({ user_id: user._id, role: user.role }, process.env.JWT_KEY, {
            expiresIn: "24h",
        });
        res.cookie("token", token, {
            maxAge: 2 * 60 * 60 * 1000,
            domain: "localhost",
        });
        res.status(200).send({
            data: user,
            message: " Login in Sucessful",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

}

const logoutUser = async (req, response) => {
    console.log(req.token)
    const token = req.token
    try {
        response.cookie("token", token, {
            maxAge: 0,
            domain: "localhost",
        });
        console.log("logout Sucessfull")
        response.status(200).send("Logout successful");
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
};


const changeRole = async (req, res) => {
    const userId = req.params.id
    try {

        const user = await userModal.findByIdAndUpdate(userId,
            {
                role: req.body.role
            }).then(async (response) => {
                const user = await userModal.findById(userId)
                console.log(user)
                res.send("Role Updated Successfully ")

            }).catch((error) => {
                res.send(error)
            })
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

module.exports = { register, login, logoutUser, changeRole }