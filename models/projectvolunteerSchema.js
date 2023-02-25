const mongoose = require('mongoose');
const projectvolunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bu: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    project_name: {
        type: String,
        required: true
    },
    project_id: {
        type: String,
        required: true
    },
    empid: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }

})

const projectvolunteer = mongoose.model('projectvolunteer', projectvolunteerSchema);
module.exports = projectvolunteer;