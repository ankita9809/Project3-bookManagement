const userModel = require("../models/userModel")


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

module.exports.createUser = createUser