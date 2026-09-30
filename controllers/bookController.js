const bookModel = require('../models/bookModel');
const authorModel = require('../models/authorModel');

function getAllBooks(req, res) {
    const { genre, year } = req.query;
    if (genre !== undefined || year !== undefined) {
        return res.json(bookModel.filterByQuery({ genre, year }));
    }
    res.json(bookModel.getAll());
}

function searchBooks(req, res) {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ error: 'Query parameter "title" is required' });
    }
    res.json(bookModel.searchByTitle(title));
}

function getBookById(req, res) {
    const id = Number(req.params.id);
    const book = bookModel.getById(id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
}

function createBook(req, res) {
    const { title, authorId, genre, year } = req.body;
    if (
        title === undefined ||
        authorId === undefined ||
        genre === undefined ||
        year === undefined
    ) {
        return res.status(400).json({ error: 'Fields title, authorId, genre and year are required' });
    }
    if (!authorModel.exists(Number(authorId))) {
        return res.status(400).json({ error: 'Author with this authorId does not exist' });
    }
    const book = bookModel.create({
        title,
        authorId: Number(authorId),
        genre,
        year: Number(year)
    });
    res.status(201).json(book);
}

function updateBook(req, res) {
    const id = Number(req.params.id);
    const existing = bookModel.getById(id);
    if (!existing) {
        return res.status(404).json({ error: 'Book not found' });
    }
    if (req.body.authorId !== undefined && !authorModel.exists(Number(req.body.authorId))) {
        return res.status(400).json({ error: 'Author with this authorId does not exist' });
    }
    const payload = { ...req.body };
    if (payload.authorId !== undefined) payload.authorId = Number(payload.authorId);
    if (payload.year !== undefined) payload.year = Number(payload.year);
    const updated = bookModel.update(id, payload);
    res.json(updated);
}

function deleteBook(req, res) {
    const id = Number(req.params.id);
    const removed = bookModel.remove(id);
    if (!removed) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted' });
}

function getStatistics(req, res) {
    const allBooks = bookModel.getAll();
    res.json({
        booksCount: allBooks.length,
        authorsCount: authorModel.getAll().length,
        genresCount: bookModel.getUniqueGenresCount(),
        newestBook: bookModel.getNewestBook(),
        oldestBook: bookModel.getOldestBook()
    });
}

module.exports = {
    getAllBooks,
    searchBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getStatistics
};
