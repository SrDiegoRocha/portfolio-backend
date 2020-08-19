const express = require('express');
const routes = express.Router();

const mongoose = require('mongoose');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function( req, file, cb ){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
});
const upload = multer({
    storage
});

const nodemailer = require('nodemailer');

const { email_sender, receverMail } = require('./config/email_config');
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // service: "gmail",
    auth: {
        user: email_sender[0],
        pass: email_sender[1]
    },
    tls: {
        rejectUnauthorized: false
    }
});

routes.post('/sendmail', (req, res) => {
    const { name, replyTo, subject, text } = req.body;

    transporter.sendMail({
        from: `${name} <${email_sender[0]}>`,
        to: receverMail,
        replyTo,
        subject,
        text,
    }, function(err, info) {
        if (err) return res.json({ok: false, err})

        return res.json({ok: true, info})
    });
});

require('./database/Models/Project');
const Project = mongoose.model('projects');

routes.get('/projects', (req, res) => {
   Project.find().then(response => {
       res.json(response);
   }) 
});

routes.get('/projects/:id', (req, res) => {
    const { id } = req.params;

    Project.findById(id)
        .then(response => {
            res.json(response);
        }).catch(error => res.json({error}));
});

routes.post('/projects', upload.single('image'), async (req, res) => {
    const { title, summary, description, source_code } = req.body;
    const { path } = req.file;
    
    if (title === undefined || summary === undefined || description === undefined || source_code === undefined || path === undefined) {
        return res.status(400).json({message: 'Something is undefined'});
    }
    
    new Project({
        title,
        summary, 
        description, 
        source_code,
        image: `http://192.168.0.106:3333/${path}`
    }).save().then(() => {
        return res.status(201).json({ message: 'Project created successfully' });
    }).catch(err => {
        return res.json({ error });
    });    
});

routes.delete('/projects/:id', (req, res) => {
    const { id } = req.params;

    Project.findByIdAndDelete(id)
        .then(response => {
            res.json(response);
        }).catch(error => res.json({error}));
});

module.exports = routes;