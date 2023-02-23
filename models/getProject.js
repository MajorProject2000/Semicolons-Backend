const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timing: {
        type: String,
        required: true
    },
    type_of_activity: {
        type: String,
        required: true
    },
    hours_required:{
        type: Number,
        required: true
    },
    images:{
        type: String,
        required: true,
      }

})


const project = mongoose.model('project', projectSchema);
module.exports = project;

