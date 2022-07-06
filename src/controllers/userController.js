const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')
const validator = require('../validator/validator')
const secretKey = 'CACA'

const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
        const { email, password } = requestBody

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ ststus: false, message: "Invalid request parameters,Empty body not accepted." })
        };
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email id is required" })
        };
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        };
    
    }catch (err) {
        return res.status(500).send({ status: false, message: "Something went wrong", Error: err.message })
    }
}