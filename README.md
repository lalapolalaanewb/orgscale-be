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

| Implementation           | Type      | Complexity             | Notes                               |
| ------------------------ | --------- | ---------------------- | ----------------------------------- |
| A - Iterative Loop       | Loop      | Time: O(n) Space: O(1) | Readable, beginner-friendly         |
| B - Mathematical Formula | Formula   | Time: O(1) Space: O(1) | Fastest, no loop required           |
| C - Recursion            | Recursion | Time: O(n) Space: O(n) | Elegant, but risk of stack overflow |

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

| Method | Endpoint        | Description                                                      |
| ------ | --------------- | ---------------------------------------------------------------- |
| GET    | `/prob-5`       | List contents (with optional filters: `status`, `page`, `limit`) |
| GET    | `/prob-5/:slug` | Get content details                                              |
| POST   | `/prob-5/new`   | Create new content                                               |
| PATCH  | `/prob-5/:slug` | Update content                                                   |
| DELETE | `/prob-5/:slug` | Delete content                                                   |

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

### 📄 Problem 6 – Architecture of Scoreboard Live Update Module

#### 📝 Overview

- Module Name: **Scoreboard Live Update**
- Purpose: Maintain a **top 10 user scoreboard** that updates in real time whenever users complete actions.
- Scope:
  - Accept authorized score updates from the frontend
  - Update the user’s score in a persistent database
  - Serve the top 10 users via API and live updates
- Non-Scope:
  - Frontend implementation of the scoreboard
  - Details of the user action (only the fact that it was completed)
  - Analytics beyond the top 10 scoreboard

---

#### 🎯 Functional Requirements

1. Users complete an action → triggers score increment.
2. Score updates are **authorized** to prevent cheating.
3. Scoreboard shows **top 10 users**, sorted by score descending.
4. Scoreboard updates **live** on the frontend.

---

#### ⚡ Non-Functional Requirements

- **Performance:** Updates should be reflected within 1–2 seconds.
- **Scalability:** Support thousands of concurrent users.
- **Reliability:** Prevent score inconsistencies, even under high load.
- **Security:** Prevent unauthorized score tampering.
- **Auditability:** Log score changes for potential review.

---

#### API Specification

**1️⃣ Update Score**

```http
POST /api/scores/update
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "user_id": "string",
  "action_id": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "Score updated successfully",
  "new_score": 125
}
```

**2️⃣ Get Top 10 Scores**

```http
GET /api/scores/top10
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "top10": [
    { "user_id": "user123", "score": 250 },
    { "user_id": "user456", "score": 240 }
  ]
}
```

---

#### Live Update Flow

```mermaid
flowchart TD
    A[User completes action] --> B[Frontend triggers API call: POST /api/scores/update]
    B --> C[API Server: Validate Authorization & Request]
    C --> D[Compute new score & update Database]
    D --> E[Publish score update to Redis Pub/Sub or Message Queue]
    E --> F[WebSocket/SSE pushes new top 10 scoreboard]
    F --> G[Frontend receives update and re-renders scoreboard]
    G --> H[User sees updated scores instantly]

    subgraph "Sample Data Flow"
        D -->|user_id: 'user123', new_score: 125| E
        E -->|top10 update: [{'user_id': 'user123', 'score':125}, ...]| F
    end
```

---

#### 🔒 Security Considerations

1. **Authentication**: Only authorized users can update scores.
2. **Validation**: `user_id` and `action_id` must be verified server-side.
3. **Rate Limiting**: Prevent spamming score updates.
4. **Server-side Authority**: Scores are computed server-side; clients cannot modify scores directly.
5. **Replay Protection**: Ensure actions cannot be submitted multiple times to inflate scores.

---

#### 📈 Improvements & Future Considerations

- Add **audit logs** for all score changes.
- Use **event sourcing** for full action history.
- Horizontal scaling with **message broker** (Redis, Kafka) for live updates.
- Implement **anti-cheat heuristics**, e.g., detect unusually high score increments.
- Allow **snapshot caching** for frequent leaderboard queries.
- Optional: add **pagination or filters** for extended leaderboard beyond top 10.

---

#### ⚡ Notes

- Backend engineers should choose suitable storage (e.g., MongoDB, PostgreSQL) for persistent scores.
- Real-time delivery can be implemented using **WebSocket** or **Server-Sent Events**, depending on frontend needs.
- Focus on **low-latency updates** while ensuring **data consistency and security**.

---

## 📄 License

MIT License

---

Feel free to fork, improve, or adapt for production use.
