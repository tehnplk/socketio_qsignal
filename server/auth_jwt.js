const express = require('express');
//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Secret key for JWT signing and encryption
const SECRET_KEY = '112233';

// Mock user data
const users = [
    {
        id: 1,
        username: 'user1',
        password: 'pass1'
    }
];

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If no token, unauthorized

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('invalid token or expire'); // If token invalid, forbidden
        req.user = user;
        next();
    });
};

// Route to login and receive a token
app.post('/login', (req, res) => {
    console.log('login', req.body)
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const accessToken = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY, { expiresIn: '30s' });
        res.json({ accessToken });
    } else {
        res.status(401).json({ message: 'Username or password incorrect' });
    }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is protected data.', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
