const  mongoose  = require('mongoose')

const adminSchema  = new mongoose.Schema({
    name: String,
    position: String,
    email: String,
    phone: String,
    picture:String
    
})

module.exports = mongoose.model("admin", adminSchema)