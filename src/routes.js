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

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // service: "gmail",
    auth: {
        user: process.env.EMAIL_SENDER_EMAIL,
        pass: process.env.EMAIL_SENDER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

routes.post('/sendmail', (req, res) => {
    const { name, replyTo, subject, text } = req.body;

    const fullText = `
        Nome: ${name}
        Email: ${replyTo}

        Assunto:

        ${text}
    `;

    transporter.sendMail({
        from: `${name} <${process.env.EMAIL_SENDER_EMAIL}>`,
        to: process.env.RECEVER_EMAIL,
        replyTo,
        subject,
        text: fullText,
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
        image: `${process.env.APP_URL}${path}`
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

routes.get('/', (req, res) => {
    res.send('você está acessando a api...');
})

module.exports = routes;