const express = require('express');
const logger = require('./middleware/logger');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const bookController = require('./controllers/bookController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.json({
        message: 'REST API (lab 2). Use paths below — not only the root URL.',
        endpoints: {
            books: [
                'GET /api/books',
                'GET /api/books?genre=fantasy&year=1937',
                'GET /api/books/search?title=node',
                'GET /api/books/:id',
                'POST /api/books',
                'PATCH /api/books/:id',
                'DELETE /api/books/:id'
            ],
            authors: [
                'GET /api/authors',
                'GET /api/authors/:id',
                'GET /api/authors/:id/books'
            ],
            other: ['GET /api/statistics']
        }
    });
});

app.get('/api/statistics', bookController.getStatistics);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
