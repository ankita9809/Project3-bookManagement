const moment =  require('moment')

   const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};

    const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

    const isValidPassword = function (password) {
    if (password.length < 8 || password.length > 15) {
        return false
    } return true
}
   

<<<<<<< HEAD
module.exports = { isValid, isValidRequestBody, isValidPassword,} 
=======
const isValidDate = function(date) {
    return moment(date, 'YYYY-MM-DD', true).isValid()
}

module.exports = { isValid, isValidRequestBody, isValidPassword, isValidDate} 
>>>>>>> ec4bd0eb9db9fb6b8ac03ad6fb3b384335de4a26
