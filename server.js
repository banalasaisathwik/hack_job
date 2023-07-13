const express = require('express');
const mongoose = require('mongoose');
const employeer = require('./routes/jobProviderRoutes.js');
const employee = require('./routes/jobSeekerRoutes.js');

mongoose.connect('mongodb+srv://banalasaisathwik:SUp9uMRGs02FwhY0@cluster0.9fvnxzf.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

const app = express();


app.use(express.json());


app.use('/api/admin', employeer);
app.use('/api/user', employee);


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
