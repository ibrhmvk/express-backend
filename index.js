const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [];
const questions = [];
const submissions = [];

// Middleware to check if user is admin
const authenticateAdmin = (req, res, next) => {
    const isAdmin = req.headers['x-role'] === 'admin';

    if (!isAdmin) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    next();
};

// User Signup
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const user = {
        name,
        email,
        password
    };
    users.push(user);

    return res.status(200).json({ message: 'User signed up successfully', user });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(user => user.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({ message: 'Login successful', user, token: 'qwert1234' });
});

// Create a new question (admin only)
app.post('/questions', authenticateAdmin, (req, res) => {
    const { title, description, testCases } = req.body;

    if (!title || !description || !testCases) {
        return res.status(400).json({ error: 'Title, description, and test cases are required' });
    }

    const newQuestion = {
        title,
        description,
        testCases
    };

    questions.push(newQuestion);

    return res.status(200).json({ message: 'Question added successfully', question: newQuestion });
});

// Create a new submission
app.post('/submissions', (req, res) => {
    const { id, description, title, solution } = req.body;

    if (!id || !solution || !description || !title || !solution) {
        return res.status(400).json({ error: 'id, solution, description, title, solution are required' });
    }

    const isAccepted = Math.random() < 0.5;
    const submission = {
        id,
        description,
        title,
        solution
    };

    if (isAccepted) {
        submissions.push(submission);
        return res.status(200).json({ message: 'Submission created', submission });
    } else {
        return res.status(200).json({ message: 'Submission rejected' });
    }
});

// Get all questions
app.get('/questions', (req, res) => {
    res.status(200).json(questions);
});

// Get all submissions
app.get('/submissions', (req, res) => {
    res.status(200).json(submissions);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
