# lab2_Denis_Grigorovskiy

**Лабораторная работа №2** — создание REST API на **Express.js**  
Студент: **Denis Grigorovskiy**

## Цель работы

Познакомиться с framework Express.js, научиться создавать маршруты, работать с параметрами URL и query parameters, возвращать данные в формате JSON и организовывать проект по архитектуре **MVC**.

---

## Node.js и Express.js

| | **Node.js** | **Express.js** |
|---|-------------|----------------|
| Что это | Среда выполнения JavaScript вне браузера | Минималистичный **фреймворк** поверх Node.js для веб-приложений |
| Задача | Запуск JS, работа с файлами, сетью, модулями | Упрощение HTTP-сервера: маршруты, middleware, JSON, Router |
| Аналогия | «Движок» | «Каркас» для API и сайтов |

Без Express можно поднять сервер на встроенном модуле `http`, но Express даёт удобные `app.get/post`, `req.params`, `express.json()` и модульную структуру.

---

## Архитектура MVC в этом проекте

```
lab2_Denis_Grigorovskiy/
├── app.js                 # Точка входа: middleware, подключение routes, запуск сервера
├── package.json
├── routes/                # Маршруты (Router) — какой URL → какой метод controller
│   ├── bookRoutes.js
│   └── authorRoutes.js
├── controllers/           # Controller — логика запроса, коды ответа, JSON
│   ├── bookController.js
│   └── authorController.js
├── models/                # Model — данные и операции с ними (массивы в памяти)
│   ├── bookModel.js
│   └── authorModel.js
└── middleware/
    └── logger.js          # Логирование каждого запроса
```

- **Model** — хранит книги и авторов, фильтрация, поиск, CRUD.
- **View** — в этой работе нет HTML-шаблонов; «представление» — **JSON** в ответе.
- **Controller** — читает `req`, вызывает model, отправляет `res.status(...).json(...)`.
- **Router** (`express.Router`) — группирует связанные пути (`/api/books`, `/api/authors`).

---

## Установка и запуск

```bash
cd lab2_Denis_Grigorovskiy
npm install
npm start
```

Сервер по умолчанию: **http://localhost:3000**

В консоли должно появиться:

```text
Server is running on http://localhost:3000
```

При каждом запросе middleware **logger** выводит строку вида:

```text
GET | /api/books | 30.09.2026 14:25
```

Формат: **HTTP Method | URL | Дата и время** (`ДД.ММ.ГГГГ ЧЧ:ММ`).

---

## Рабочие адреса (базовый URL)

| Назначение | URL |
|------------|-----|
| Справка по API (корень) | http://localhost:3000/ |
| Все книги | http://localhost:3000/api/books |
| Книга по id | http://localhost:3000/api/books/1 |
| Поиск по названию (задание 8.1) | http://localhost:3000/api/books/search?title=node |
| Фильтр по жанру | http://localhost:3000/api/books?genre=fantasy |
| Фильтр по году | http://localhost:3000/api/books?year=2008 |
| Жанр + год | http://localhost:3000/api/books?genre=fantasy&year=1937 |
| Все авторы | http://localhost:3000/api/authors |
| Автор по id | http://localhost:3000/api/authors/1 |
| Книги автора | http://localhost:3000/api/authors/1/books |
| Статистика (задание 8.2) | http://localhost:3000/api/statistics |

> **Важно:** если открыть только `http://localhost:3000/` до запуска актуальной версии или перейти на несуществующий путь (например `/api/unknown`), сервер вернёт `{"error":"Route not found"}` и код **404** — это обработка неизвестных маршрутов (п. 7 задания).

---

## Исходные данные (models)

### Книги (не менее 5)

| id | title | authorId | genre | year |
|----|--------|----------|--------|------|
| 1 | The Hobbit | 1 | fantasy | 1937 |
| 2 | 1984 | 2 | dystopia | 1949 |
| 3 | The Lord of the Rings | 1 | fantasy | 1954 |
| 4 | Animal Farm | 2 | dystopia | 1945 |
| 5 | Node.js Design Patterns | 3 | programming | 2020 |

### Авторы (не менее 3)

| id | name | country |
|----|------|---------|
| 1 | J. R. R. Tolkien | United Kingdom |
| 2 | George Orwell | United Kingdom |
| 3 | Mario Casciaro | Italy |

Данные лежат в `models/bookModel.js` и `models/authorModel.js`.

---

## Маршруты API

### Книги

| Метод | URL | Назначение | Успешный код |
|-------|-----|------------|--------------|
| GET | `/api/books` | Все книги (с опциональной фильтрацией) | 200 |
| GET | `/api/books/:id` | Книга по ID | 200 / 404 |
| POST | `/api/books` | Добавить книгу | 201 / 400 |
| PATCH | `/api/books/:id` | Изменить книгу | 200 / 404 / 400 |
| DELETE | `/api/books/:id` | Удалить книгу | 200 / 404 |

**Пример — книга найдена:**

```http
GET /api/books/2
```

```json
{
  "id": 2,
  "title": "1984",
  "authorId": 2,
  "genre": "dystopia",
  "year": 1949
}
```

**Пример — книга не найдена (404):**

```json
{
  "error": "Book not found"
}
```

### Добавление книги (POST)

Подключено в `app.js`: `app.use(express.json());`

```http
POST /api/books
Content-Type: application/json
```

```json
{
  "title": "Clean Code",
  "authorId": 3,
  "genre": "programming",
  "year": 2008
}
```

Ответ: **201 Created** и созданная книга с новым `id`.

Обязательные поля: `title`, `authorId`, `genre`, `year`. Если чего-то нет — **400 Bad Request**.

### Задание 8.3 — проверка автора

При POST (и при PATCH, если меняется `authorId`) проверяется, что автор с таким `authorId` существует. Иначе **400**:

```json
{
  "error": "Author with this authorId does not exist"
}
```

### Фильтрация (query parameters)

- `GET /api/books?genre=fantasy`
- `GET /api/books?year=2008`
- `GET /api/books?genre=fantasy&year=1937`

Без параметров — возвращаются **все** книги.

### Задание 8.1 — поиск по части названия

```http
GET /api/books/search?title=node
```

Поиск **без учёта регистра** (найдёт «Node.js Design Patterns»). Маршрут `/search` объявлен **раньше** `/:id`, иначе слово `search` воспринималось бы как id.

### Авторы

| Метод | URL | Назначение |
|-------|-----|------------|
| GET | `/api/authors` | Все авторы |
| GET | `/api/authors/:id` | Автор по ID (404 если нет) |
| GET | `/api/authors/:id/books` | Книги выбранного автора |

### Задание 8.2 — статистика

```http
GET /api/statistics
```

Пример ответа:

```json
{
  "booksCount": 5,
  "authorsCount": 3,
  "genresCount": 3,
  "newestBook": { "id": 5, "title": "Node.js Design Patterns", "authorId": 3, "genre": "programming", "year": 2020 },
  "oldestBook": { "id": 1, "title": "The Hobbit", "authorId": 1, "genre": "fantasy", "year": 1937 }
}
```

---

## req.params, req.query, req.body

| Объект | Откуда | Пример в проекте |
|--------|--------|------------------|
| `req.params` | Сегменты пути | `GET /api/books/2` → `req.params.id === "2"` |
| `req.query` | Строка запроса после `?` | `?genre=fantasy&year=1937` → `req.query.genre`, `req.query.year` |
| `req.body` | Тело JSON (POST/PATCH) | Поля новой книги после `express.json()` |

---

## HTTP-коды для демонстрации на защите

| Код | Когда в этом API |
|-----|------------------|
| **200** | Успешный GET, PATCH, DELETE |
| **201** | Книга успешно создана (POST) |
| **400** | Нет обязательного поля; несуществующий `authorId` |
| **404** | Книга/автор не найдены; неизвестный URL (`Route not found`) |

---

## Примеры запросов (PowerShell)

```powershell
# GET — все книги
Invoke-RestMethod http://localhost:3000/api/books

# GET — фильтр
Invoke-RestMethod "http://localhost:3000/api/books?genre=fantasy&year=1937"

# GET — поиск
Invoke-RestMethod "http://localhost:3000/api/books/search?title=node"

# POST — новая книга
Invoke-RestMethod http://localhost:3000/api/books -Method POST -ContentType "application/json" -Body '{"title":"Clean Code","authorId":3,"genre":"programming","year":2008}'

# PATCH — изменить год
Invoke-RestMethod http://localhost:3000/api/books/6 -Method PATCH -ContentType "application/json" -Body '{"year":2009}'

# DELETE
Invoke-RestMethod http://localhost:3000/api/books/6 -Method Delete

# 404 — несуществующий маршрут
Invoke-RestMethod http://localhost:3000/api/not-exists
```

Для POST, PATCH и DELETE удобно использовать **Postman**, **Thunder Client** (VS Code) или **curl**.

---

## Чек-лист заданий лабораторной

- [x] Проект Express, структура MVC (routes, controllers, models, middleware)
- [x] Массивы книг (≥5) и авторов (≥3) в `models`
- [x] CRUD и GET для книг и авторов
- [x] `express.json()` для POST
- [x] Фильтрация `genre`, `year`, комбинация
- [x] Middleware logger на все маршруты
- [x] 404 для неизвестных URL
- [x] **8.1** Поиск `/api/books/search?title=...` (регистронезависимо)
- [x] **8.2** `/api/statistics`
- [x] **8.3** Проверка существования автора при добавлении книги

---

## Репозиторий

GitHub: [https://github.com/DenisGrigorovschii/lab2_Denis_Grigorovskiy](https://github.com/DenisGrigorovschii/lab2_Denis_Grigorovskiy)

```bash
git clone https://github.com/DenisGrigorovschii/lab2_Denis_Grigorovskiy.git
cd lab2_Denis_Grigorovskiy
npm install
npm start
```

---

## Лицензия

Учебный проект, ISC (см. `package.json`).
