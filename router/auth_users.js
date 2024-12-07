const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET_KEY = 'your_jwt_secret_key';


const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
    const user = users.find(user => user.username === username);
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required!" });
    }

    // Check if the username exists and password is correct
    if (authenticatedUser(username, password)) {
        // If valid, generate a JWT token
        const token = jwt.sign({ username }, JWT_SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
        return res.status(200).json({
            message: "Login successful",
            token: token
        });
    } else {
        // If not valid, send an error message
        return res.status(401).json({ message: "Invalid username or password!" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;  // Get ISBN from the URL
    const { review } = req.query;  // Get review from query parameters

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required!" });
    }

    // Check if the ISBN exists in the books object
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found!" });
    }

    // Initialize reviews if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = [];
    }

    // Add or update the review for the given ISBN
    books[isbn].reviews.push(review);

    return res.status(200).json({ message: "Review added/updated successfully!" });

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
