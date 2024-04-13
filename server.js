// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/spa_booking', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Mongoose schemas and models for each form
const Schema = mongoose.Schema;

const form1Schema = new Schema({
    visitor_name: String,
    visitor_email: String,
    visitor_phone: String,
    checkin: Date,
    time: String,
    booking_type: String,
    gender: String,
    visitor_message: String
});

const Form1Data = mongoose.model('Form1Data', form1Schema);

const form2Schema = new Schema({
    name: String,
    email: String,
    phone: String,
    gender: String,
    age: Number,
    checkin: Date,
    time: String,
    booking_type: String,
    visitor_message: String
});

const Form2Data = mongoose.model('Form2Data', form2Schema);

const form3Schema = new Schema({
    name: String,
    email: String,
    phone: String,
    event_datetime: Date,
    hall_type: String,
    food_selection: String,
    food_quantity: Number,
    drink_selection: String,
    snacks_selection: String,
    visitor_message: String
});

const Form3Data = mongoose.model('Form3Data', form3Schema);

// Define schema and model for Form 4
const form4Schema = new Schema({
    visitor_name: String,
    visitor_email: String,
    visitor_phone: String,
    checkin: Date,
    checkout: Date,
    ac_preference: String,
    seater_preference: String,
    food_preference: String,
    food_selection: String,
    food_quantity: Number,
    visitor_message: String
});

const Form4Data = mongoose.model('Form4Data', form4Schema);

// Define Mongoose schema and model for user data
const userSchema = new Schema({
    username: String,
    email: String,
    password: String
});

const UserData = mongoose.model('UserData', userSchema);

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Define Express routes for each form
app.post('/form1', async (req, res) => {
    try {
        const formData = new Form1Data({
            visitor_name: req.body.visitor_name,
            visitor_email: req.body.visitor_email,
            visitor_phone: req.body.visitor_phone,
            checkin: req.body.checkin,
            time: req.body.time,
            booking_type: req.body.booking_type,
            gender: req.body.gender,
            visitor_message: req.body.visitor_message
        });
        await formData.save();
        res.redirect('/index.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
});

app.post('/form2', async (req, res) => {
    try {
        const formData = new Form2Data({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            age: req.body.age,
            checkin: req.body.checkin,
            time: req.body.time,
            booking_type: req.body.booking_type,
            visitor_message: req.body.visitor_message
        });
        await formData.save();
        res.redirect('/index.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
});

app.post('/form3', async (req, res) => {
    try {
        const formData = new Form3Data({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            event_datetime: req.body.event_datetime,
            hall_type: req.body.hall_type,
            food_selection: req.body.food_selection,
            food_quantity: req.body.food_quantity,
            drink_selection: req.body.drink_selection,
            snacks_selection: req.body.snacks_selection,
            visitor_message: req.body.visitor_message
        });
        await formData.save();
        res.redirect('/index.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
});

// Define Express route for Form 4
app.post('/form4', async (req, res) => {
    try {
        const formData = new Form4Data({
            visitor_name: req.body.visitor_name,
            visitor_email: req.body.visitor_email,
            visitor_phone: req.body.visitor_phone,
            checkin: req.body.checkin,
            checkout: req.body.checkout,
            ac_preference: req.body.ac_preference,
            seater_preference: req.body.seater_preference,
            food_preference: req.body.food_preference,
            food_selection: req.body.food_selection,
            food_quantity: req.body.food_quantity,
            visitor_message: req.body.visitor_message
        });
        await formData.save();
        res.redirect('/index.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data');
    }
});

// Define Express routes for login and register

// Register route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserData.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const newUser = new UserData({ username, email, password });
        await newUser.save();
        res.redirect('/index.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserData.findOne({ email, password });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }
        res.redirect('/index.html'); // Redirect to dashboard upon successful login
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

// Define a route to fetch and display data
app.get('/fetchFormData', async (req, res) => {
    try {
        // Fetch data from all forms
        const form1Data = await Form1Data.find();
        const form2Data = await Form2Data.find();
        const form3Data = await Form3Data.find();
        const form4Data = await Form4Data.find();

        // Log the fetched data
        console.log("Form 1 Data:", form1Data);
        console.log("Form 2 Data:", form2Data);
        console.log("Form 3 Data:", form3Data);
        console.log("Form 4 Data:", form4Data);

        // Send the fetched data as a response (optional)
        res.json({ form1Data, form2Data, form3Data, form4Data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
