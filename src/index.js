const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const  mongoose  = require('mongoose');
const app = express(); 

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://chetan-chetanya-ankita-arjun:cXZH7N7BXqICICPb@cluster0.vcmws9j.mongodb.net/group10Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
}) 