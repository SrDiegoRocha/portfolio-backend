const mongoose = require('mongoose');

const Project = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    source_code: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

mongoose.model('projects', Project);