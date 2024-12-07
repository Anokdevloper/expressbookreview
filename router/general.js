const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    // Validate if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Save the new user to the 'database' (users object)
    users[username] = { password };

    // Return success message
    return res.status(201).json({ message: "User registered successfully" });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const booksJSON = JSON.stringify(books);
  return res.status(200).send(booksJSON);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const book = books[isbn]; // Find the book in the books object

    if (book) {
        // If book exists, return it
        return res.status(200).json(book);
    } else {
        // If book doesn't exist, return an error message
        return res.status(200).json({ message: "Book not found" });
    }

});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase(); // Get the author from the URL and make it case insensitive
    const matchedBooks = [];

    // Iterate through the books object
    for (let isbn in books) {
        // Check if the author's name matches
        if (books[isbn].author.toLowerCase() === author) {
            matchedBooks.push(books[isbn]); // Add matched book to the array
        }
    }

    // If no books are found for that author
    if (matchedBooks.length === 0) {
        return res.status(404).json({ message: "No books found by this author" });
    }

    // Return matched books
    return res.status(200).json(matchedBooks);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase(); // Get the title from the URL and make it case insensitive
    const matchedBooks = [];

    // Iterate through the books object
    for (let isbn in books) {
        // Check if the book's title matches
        if (books[isbn].title.toLowerCase().includes(title)) {
            matchedBooks.push(books[isbn]); // Add matched book to the array
        }
    }

    // If no books are found with the specified title
    if (matchedBooks.length === 0) {
        return res.status(404).json({ message: "No books found with this title" });
    }

    // Return matched books
    return res.status(200).json(matchedBooks);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from URL
    const book = books[isbn]; // Find the book by ISBN

    // Check if the book exists
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book has reviews
    if (Object.keys(book.reviews).length === null) {
        return res.status(404).json({ message: "No reviews available for this book" });
    }

    // Return the reviews of the book
    return res.status(200).json(book.reviews);

});




module.exports.general = public_users;
