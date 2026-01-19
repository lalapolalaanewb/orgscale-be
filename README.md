# OrgScale Backend (orgscale-be)

A TypeScript-based backend service built with **Express**, **MongoDB**, and **Redis**, containerized using **Docker**.
This project demonstrates REST API design, caching strategies, input validation, and algorithmic problem solving.

---

## ✨ Features

- Express.js API (TypeScript)
- MongoDB integration (CRUD operations)
- Redis caching layer
- API key–based authentication middleware
- Docker & Docker Compose support
- Environment-based configuration
- Algorithm demonstration endpoint (Problem 4)

---

## 🛠 Tech Stack

- **Node.js** (v20)
- **TypeScript**
- **Express**
- **MongoDB**
- **Redis**
- **Docker & Docker Compose**
- **Yarn**

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── problem-4.ts        # Algorithm implementations
│   └── problem-5.ts        # Content CRUD + caching
├── middleware/
│   └── auth.ts             # API key authentication
├── routes/
│   └── index.ts            # API routes
├── services/
│   ├── db.ts               # MongoDB connection
│   └── redis.ts            # Redis client
├── utils/
│   └── handleQuery.ts      # Query helpers
├── validations/
│   └── problem-5.ts        # Request validation
└── index.ts                # App entry point
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/orgscale-be.git
cd orgscale-be
```

---

### 2️⃣ Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

MONGO_DB_NAME=orgscale
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
MONGODB_URI=mongodb://admin:password@mongo:27017/orgscale?authSource=admin

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redispassword

API_KEY=your-secret-api-key
```

---

## 🐳 Running with Docker (Recommended)

```bash
docker-compose up --build
```

Services started:

- API server → `http://localhost:3000`
- MongoDB → `localhost:27017`
- Redis → `localhost:6379`

---

## 🧑‍💻 Running Locally (Without Docker)

### Install dependencies

```bash
yarn install
```

### Run in development

```bash
yarn dev
```

### Build

```bash
yarn build
```

### Start production build

```bash
yarn start
```

---

## 🔐 Authentication

Some endpoints require an API key.

Include this header in your request:

```
x-api-key: your-secret-api-key
```

---

## 📡 API Endpoints

### 🔢 Problem 4 – Sum of Numbers

Demonstrates three implementations to calculate the sum from `1` to `n`.

```
GET /prob-4/:num
```

Example:

```
GET /prob-4/10
```

Returns an HTML page comparing:

- Iterative loop
- Mathematical formula
- Recursive approach
  with **time & space complexity**, **pros**, and **cons**.

---

### 📄 Problem 5 – Content Management API

#### Get contents (with filters & pagination)

```
GET /prob-5?status=published&page=0&limit=30
```

#### Get single content (cached with Redis)

```
GET /prob-5/:slug
```

#### Create content

```
POST /prob-5/new
```

#### Update content

```
PATCH /prob-5/:slug
```

#### Delete content

```
DELETE /prob-5/:slug
```

---

### 🧪 Quick Test with cURL (Problem 5)

> Make sure the server is running and MongoDB + Redis are up.
> Replace `YOUR_API_KEY` with the value from your `.env` file.

---

#### 1️⃣ Create New Content

```bash
curl -X POST http://localhost:3000/prob-5/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "alt": "Example image alt text",
    "description": "Full content description",
    "created_at": "2026-01-01T00:00:00.000Z",
    "created_by": "admin",
    "title": "Hello World",
    "related": ["intro", "example"],
    "slug": "hello-world",
    "status": "published",
    "subDesc": "Short summary",
    "tags": ["demo", "test"],
    "thumbnailUrl": "https://example.com/image.png"
  }'
```

Expected response:

```
204 No Content
```

---

#### 2️⃣ Get All Contents (with pagination)

```bash
curl "http://localhost:3000/prob-5?limit=10&page=0"
```

---

#### 3️⃣ Get Single Content (Redis cached)

```bash
curl http://localhost:3000/prob-5/hello-world
```

> The first request hits MongoDB.
> Subsequent requests within 60 seconds are served from Redis.

---

#### 4️⃣ Update Content (Cache Invalidation)

```bash
curl -X PATCH http://localhost:3000/prob-5/hello-world \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Hello World (Updated)",
    "by": "editor"
  }'
```

Expected response:

```
204 No Content
```

---

#### 5️⃣ Delete Content

```bash
curl -X DELETE http://localhost:3000/prob-5/hello-world \
  -H "x-api-key: YOUR_API_KEY"
```

Expected response:

```
204 No Content
```

---

#### 6️⃣ Verify Cache Invalidation

```bash
curl http://localhost:3000/prob-5/hello-world
```

Expected response:

```
404 Content not found
```

---

💡 **Tip:**
Check Redis logs to observe cache hits and invalidation behavior.

---

## ⚡ Caching Strategy

- Redis caches content by `slug`
- Cache TTL: **60 seconds**
- Cache automatically invalidated on update & delete

---

## 📦 Scripts

| Script       | Description            |
| ------------ | ---------------------- |
| `yarn dev`   | Run development server |
| `yarn build` | Compile TypeScript     |
| `yarn start` | Run production build   |

---

## 🧪 Validation & Error Handling

- Request validation for params and body
- Graceful error responses
- Proper HTTP status codes

---

## 📄 License

MIT License

---

## 🙌 Notes

This project is suitable for:

- Backend technical tests
- System design demonstrations
- API & caching examples
- Dockerized Node.js services

Feel free to fork, improve, or adapt for production use.
