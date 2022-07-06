const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')
const validator = require('../validator/validator')
const secretKey = 'CACA'


// ----------------------- CREATE USER -------------------
 
const createUser= async function(req, res){
    try{
        const userData = req.body
        const { title, name, phone, email, password, address} = userData

        if(!validator.isValidRequestBody(userData)){
            return res.status(400).send({status: false, message: "Body is empty, please Provide data"})
        };
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        };
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        };
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "Phone is required" })
        };
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email id is required" })
        };
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        };
        if (!validator.isValid(address)) {
            return res.status(400).send({ status: false, message: "Address is required" })
        };

        let savedData = await userModel.create(userData)
        return res.status(201).send({status: true, message: "Success", data: savedData })

    } catch(error){
        res.status(500).send({status: false, message: error.message})
    }
}

// ----------------------- CREATE USER -------------------

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
    
    }catch (err) {
        return res.status(500).send({ status: false, message: "Something went wrong", Error: err.message })
    }
}



module.exports = {createUser, loginUser}

