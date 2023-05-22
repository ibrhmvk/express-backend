const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSIONS = [{
    id: 1,
    description: "Given an array , return the element of the array?",
    title: "Two Sates",
    solution: "Solution it is"
}]

app.post('/signup', (req, res) => {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existingUser = USERS.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const user = {
        name,
        email,
        password,
        role
    };
    USERS.push(user);

    return res.status(200).json({ message: 'User signed up successfully', user });
});

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = USERS.find(user => user.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({ message: 'Login successful', user, token: "qwert1234" });
})

app.get('/questions', (req, res) => {
    res.status(200).json(QUESTIONS);
});

app.get("/submissions", (req, res) => {
    res.status(200).json(SUBMISSIONS);
});


app.post("/submissions", (req, res) => {
    const { solution } = req.body;

    if (!solution) {
        return res.status(400).json({ error: "Solution is required" });
    }

    const isAccepted = Math.random() < 0.5; 

    const submission = {
        solution,
        timestamp: new Date().toISOString(),
    };
    if (isAccepted) {
        SUBMISSIONS.push(submission);
        res.status(200).json({ message: "Submission created", submission });
    }
    res.status(200).json({ message: "Submission Rejected" });

});

app.post('/questions', (req, res) => {
    const { title, description, testCases } = req.body;

    const isAdmin = req.headers['x-role'] === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    if (!title || !description || !testCases) {
        return res.status(400).json({ error: 'Title, description, and test cases are required' });
    }

    const newQuestion = {
        title,
        description,
        testCases,
    };

    QUESTIONS.push(newQuestion);

    return res.status(200).json({ message: 'Question added successfully', question: newQuestion });
});


app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
})