const books = [
    {
        id: 1,
        title: 'The Hobbit',
        authorId: 1,
        genre: 'fantasy',
        year: 1937
    },
    {
        id: 2,
        title: '1984',
        authorId: 2,
        genre: 'dystopia',
        year: 1949
    },
    {
        id: 3,
        title: 'The Lord of the Rings',
        authorId: 1,
        genre: 'fantasy',
        year: 1954
    },
    {
        id: 4,
        title: 'Animal Farm',
        authorId: 2,
        genre: 'dystopia',
        year: 1945
    },
    {
        id: 5,
        title: 'Node.js Design Patterns',
        authorId: 3,
        genre: 'programming',
        year: 2020
    }
];

let nextId = 6;

function getAll() {
    return books;
}

function getById(id) {
    return books.find((book) => book.id === id);
}

function filterByQuery({ genre, year }) {
    let result = [...books];
    if (genre !== undefined) {
        result = result.filter((book) => book.genre === genre);
    }
    if (year !== undefined) {
        const yearNum = Number(year);
        result = result.filter((book) => book.year === yearNum);
    }
    return result;
}

function searchByTitle(titlePart) {
    const needle = titlePart.toLowerCase();
    return books.filter((book) => book.title.toLowerCase().includes(needle));
}

function create(data) {
    const book = { id: nextId++, ...data };
    books.push(book);
    return book;
}

function update(id, data) {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...data, id };
    return books[index];
}

function remove(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
}

function getByAuthorId(authorId) {
    return books.filter((book) => book.authorId === authorId);
}

function getUniqueGenresCount() {
    return new Set(books.map((book) => book.genre)).size;
}

function getNewestBook() {
    if (books.length === 0) return null;
    return books.reduce((a, b) => (b.year > a.year ? b : a));
}

function getOldestBook() {
    if (books.length === 0) return null;
    return books.reduce((a, b) => (b.year < a.year ? b : a));
}

module.exports = {
    getAll,
    getById,
    filterByQuery,
    searchByTitle,
    create,
    update,
    remove,
    getByAuthorId,
    getUniqueGenresCount,
    getNewestBook,
    getOldestBook
};
