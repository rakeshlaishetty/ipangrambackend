const mongoose = require('mongoose')

const rolesSchema = new mongoose.Schema({
    roleName:{
        type:String,
    }
})

const role = new mongoose.model('roles',rolesSchema)

module.exports = role