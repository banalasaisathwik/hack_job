const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel');
const Jobs = require('../models/JobModel');
const fs = require("fs");


const SECRET = " sai";

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    function callback(admin) {
        if (admin) {
            res.status(403).json({ message: 'Admin already exists' });
        } else {
            const obj = { username: username, password: password };
            const newAdmin = new Admin(obj);
            newAdmin.save();
            const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
            res.json({ message: 'Admin created successfully', token });
        }

    }
    Admin.findOne({ username }).then(callback);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});


router.post('/addJobs', authenticateJwt, async (req, res) => {
    const { title, description, salary } = req.body;
    const skills = req.body.skills || [];
    const admin = req.user.username;

    try {
        // new job
        const newJob = new Jobs({
            title,
            skills: [],
            description,
            salary,
        });

        // Saveto the database
        await newJob.save();

        res.status(201).json({ message: 'Job added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add job' });
    }
});
router.get('/candiate', (req, res) => {
    fs.readFile("applied.json", "utf8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

router.get('/filter/experience', async (req, res) => {
    const { minExperience } = req.query;

    try {
        const candidates = await UserModel.find({
            experience: { $gte: minExperience },
        });

        res.status(200).json({ candidates });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve', error });
    }
});


module.exports = router;
