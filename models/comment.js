var mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    orderId:{type:String},
    user:{type:String},
    text:{type:String},
    date:{type:Date}

})

const Comment = mongoose.model("Comment",commentSchema)

module.exports = Comment