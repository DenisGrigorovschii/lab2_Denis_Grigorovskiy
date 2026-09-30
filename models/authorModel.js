const authors = [
    {
        id: 1,
        name: 'J. R. R. Tolkien',
        country: 'United Kingdom'
    },
    {
        id: 2,
        name: 'George Orwell',
        country: 'United Kingdom'
    },
    {
        id: 3,
        name: 'Mario Casciaro',
        country: 'Italy'
    }
];

function getAll() {
    return authors;
}

function getById(id) {
    return authors.find((author) => author.id === id);
}

function exists(id) {
    return authors.some((author) => author.id === id);
}

module.exports = {
    getAll,
    getById,
    exists
};
