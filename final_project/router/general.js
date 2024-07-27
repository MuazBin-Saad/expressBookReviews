const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password;
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const isbn_int = parseInt(isbn)
  let isbn_book = books[isbn_int]
  res.send(isbn_book)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const author_books = []
  for (const numb in books){
    if (books[numb].author === author){
        author_books.push(books[numb])
  }}
  res.send(author_books)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const title_books = []
  for (const numb in books){
    if (books[numb].title === title){
        title_books.push(books[numb])
  }}
  res.send(title_books)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const isbn_int = parseInt(isbn)
    //books[isbn_int].review = 'THIS IS A SAMPLE REVIEW'
    let isbn_book = books[isbn_int].review

    res.send(isbn_book)
});

module.exports.general = public_users;
