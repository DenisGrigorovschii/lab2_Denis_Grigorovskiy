const authorModel = require('../models/authorModel');
const bookModel = require('../models/bookModel');

function getAllAuthors(req, res) {
    res.json(authorModel.getAll());
}

function getAuthorById(req, res) {
    const id = Number(req.params.id);
    const author = authorModel.getById(id);
    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
}

function getAuthorBooks(req, res) {
    const id = Number(req.params.id);
    const author = authorModel.getById(id);
    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }
    res.json(bookModel.getByAuthorId(id));
}

module.exports = {
    getAllAuthors,
    getAuthorById,
    getAuthorBooks
};
