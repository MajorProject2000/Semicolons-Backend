const mongoose = require('mongoose');
const contactMsgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
   
})

const contactData = mongoose.model('contactData', contactMsgSchema);
module.exports = contactData;