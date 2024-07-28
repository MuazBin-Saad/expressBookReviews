const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn_num = parseInt(req.params.isbn);
    const username = req.session.authorization.username
    const review = req.body.review;

    // Check if the book exists
    if (!books[isbn_num]) {
        return res.status(404).json({ error: "Book not found" });
    }

    // Check if username and review are provided
    if (!username || !review) {
        return res.status(400).json({ error: "Username and review are required" });
    }

    // Add the review
    books[isbn_num].reviews[username] = review;

    // Respond with the updated book reviews
    res.status(200).json(books[isbn_num].reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn_num = parseInt(req.params.isbn);
    const username = req.session.authorization.username

    // Check if the book exists
    if (!books[isbn_num]) {
        return res.status(404).json({ error: "Book not found" });
    }

    // Check if the review by the specified user exists
    if (!books[isbn_num].reviews[username]) {
        return res.status(404).json({ error: "Review by this user not found" });
    }

    // Delete the review
    delete books[isbn_num].reviews[username];

    // Respond with the updated book reviews
    res.status(200).json(books[isbn_num].reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
