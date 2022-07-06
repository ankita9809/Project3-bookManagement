const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')
const validator = require('../validator/validator')
const secretKey = 'CACA'


// ----------------------- CREATE USER -------------------

const createUser= async function(req, res){
    try{
        const userData = req.body

        let savedData = await userModel.create(userData)
        return res.status(201).send({status: true, message: "Success", data: savedData })

    } catch(error){
        res.status(500).send({status: false, message: error.message})
    }
    

}

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
        const findCredentials = await userModel.findOne({ email,password })
        if (!findCredentials) {
            return res.status(401).send({ status: false, message: `Invalid login credentials. Email id or password is incorrect.` });
        }
        const id = findCredentials._id
        const token = await jwt.sign({ userId:id }, secretKey , { expiresIn: "24h" })
        res.header('x-api-key');
        return res.status(200).send({ status: true, message: `User logged in successfully.`, data: token });
    }catch (err) {
        return res.status(500).send({ status: false, message: "Something went wrong", Error: err.message })
    }
}



module.exports = {createUser, loginUser}

