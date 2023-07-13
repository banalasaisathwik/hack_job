const express = require('express');
const UserModel = require('../models/UserModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require("fs");

router.use(express.json());

const SECRET = "sai";

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

router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'username or email already used' });
    }

    const newUser = new UserModel({ username, password, email });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'user created successfully', token });

  } catch (error) {
    res.status(500).json({ message: 'sorry, please try again' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (existingUser.password !== password) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'user logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'failed to log in, try again' });
  }
});

router.post('/me', authenticateJwt, (req, res) => {
  const { college, education, position, experience } = req.body;

  try {
    user.college = college;
    user.experience = experience;
    user.education = education;
    user.position = position;

    user.save();

    res.status(200).json({ message: 'user profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'failed to update user profile' });
  }
});

router.get('/jobs', authenticateJwt, async (req, res) => {

  try {
    const jobs = await JobModel.find();

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrievelistings' });
  }
});

router.post('/apply', authenticateJwt, (req, res) => {
  if (req.user.education & req.user.position) {
    fs.writeFile("applied.json", JSON.stringify(req.user), (err) => {
      if (err) throw err;
      res.status(201);
    });
  }
  else {
    res.status.send('fill all your details in profile section');
  }

});

router.get('/filter/package', async (req, res) => {
  const { package } = req.query;

  try {
    // Retrieve candidates with experience greater than or equal to the minimum requirement
    const jobs = await JobModel.find({
      salary: { $gte: package },
    });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Failed', error });
  }
});


module.exports = router;


