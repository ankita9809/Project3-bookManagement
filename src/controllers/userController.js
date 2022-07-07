const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')
const validator = require('../validator/validator')
const secretKey = 'CACA'

// --------------------------- REGEX -----------------------------
const nameRegex = /^[ a-z ]+$/i
const mobileRegex = /^[6-9]\d{9}$/
const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/


// ----------------------- CREATE USER -------------------

const createUser = async function (req, res) {
    try {
        const userData = req.body
        const { title, name, phone, email, password, address } = userData

        if (!validator.isValidRequestBody(userData)) {
            return res.status(400).send({ status: false, message: "Body is empty, please Provide data" })
        };
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        };
        if (["Mr", "Mrs", "Miss"].indexOf(title) == -1) {
            return res.status(400).send({ status: false, message: "Invalid title, Please select from Mr, Mrs, Miss" })
        };
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        };
        if (!name.match(nameRegex)) {
            return res.status(400).send({ status: false, message: "Please Provide correct input for name" })
        };
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "Phone is required" })
        };
        if (!mobileRegex.test(phone)) {
            return res.status(400).send({ status: false, message: "Please Provide valid Mobile No" })
        };
        let duplicateMobile = await userModel.findOne({ phone: phone });
        if (duplicateMobile) {
            return res.status(400).send({ status: false, message: "Mobile No. already exists!" });
        };
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email id is required" })
        };
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Please Enter Email in valid Format" })
        };
        let duplicateEmail = await userModel.findOne({ email: email });
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: "Email already exists!" });
        };
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        };
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password should be between 8 and 15 characters." })
        };
        if (address && typeof address != "object") {
            return res.status(400).send({ status: false, message: "Address is in wrong format" })
        };
        if (address && address.street && !validator.isValid(address.street)) {
            return res.status(400).send({ status: false, message: "Street is required" })
        };
        if (address && address.city && !validator.isValid(address.city)) {
            return res.status(400).send({ status: false, message: "City is required" })
        };
        if (address && address.pincode && !validator.isValid(address.pincode)) {
            return res.status(400).send({ status: false, message: "Pincode is required" })
        };


        let savedData = await userModel.create(userData)
        return res.status(201).send({ status: true, message: "Success", data: savedData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// ----------------------- USER LOGIN -------------------

const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
        const { email, password } = requestBody

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters,Empty body not accepted." })
        };
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email id is required" })
        };
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        };
        const findCredentials = await userModel.findOne({ email, password })
        if (!findCredentials) {
            return res.status(401).send({ status: false, message: `Invalid login credentials. Email id or password is incorrect.` });
        }
        const id = findCredentials._id
        const token = await jwt.sign({ userId: id }, secretKey, { expiresIn: "24h" })
        return res.status(200).send({ status: true, message: `User logged in successfully.`, data: token });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { createUser, loginUser }

