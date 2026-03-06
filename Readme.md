# Event-Driven User Activity Tracker

## Overview

This project implements an **event-driven microservice architecture** for tracking user activities.  
A REST API is used to ingest activity events and publish them to a **RabbitMQ message queue**. A separate **consumer service** processes these events asynchronously and stores them in a **MongoDB database**.

The architecture ensures **scalability, reliability, and resilience** for high-volume event ingestion systems used in modern backend platforms.

---

# Architecture

The system consists of four services:

1. **API Service**
   - Accepts activity events
   - Validates input
   - Applies rate limiting
   - Publishes events to RabbitMQ

2. **RabbitMQ**
   - Message broker
   - Decouples API from consumer
   - Ensures reliable event delivery

3. **Consumer Worker**
   - Consumes events from RabbitMQ
   - Processes activity messages
   - Stores them in MongoDB

4. **MongoDB**
   - Stores processed activity data

---

# Architecture Flow

Client  
↓  
API Service (Node.js + Express)  
↓  
RabbitMQ Queue (`user_activities`)  
↓  
Consumer Worker  
↓  
MongoDB Database  

---

# Technologies Used

- Node.js
- Express.js
- RabbitMQ
- MongoDB
- Mongoose
- Docker
- Docker Compose
- Express Rate Limit

---

# Project Structure

```
event-tracker
│
├── api
│   ├── src
│   │   ├── controllers
│   │   │   └── activityController.js
│   │   ├── middlewares
│   │   │   └── rateLimiter.js
│   │   ├── routes
│   │   │   └── activityRoutes.js
│   │   ├── rabbitmq
│   │   │   └── connection.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── consumer
│   ├── src
│   │   ├── services
│   │   │   └── activityProcessor.js
│   │   └── worker.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── README.md
└── API_DOCS.md
```

---

# Features

- Event-driven architecture
- RabbitMQ message queue integration
- Asynchronous event processing
- MongoDB persistent storage
- IP-based rate limiting
- Docker containerization
- Multi-service deployment using Docker Compose
- Robust error handling

---

# API Endpoint

## POST /api/v1/activities

Used to ingest user activity events.

### Request Body

```json
{
  "userId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "eventType": "user_login",
  "timestamp": "2023-10-27T10:00:00Z",
  "payload": {
    "ipAddress": "192.168.1.1",
    "device": "desktop",
    "browser": "Chrome"
  }
}
```

### Responses

| Status Code | Description |
|-------------|-------------|
| 202 | Event accepted and queued |
| 400 | Invalid request body |
| 429 | Rate limit exceeded |

---

# Rate Limiting

The API implements **IP-based rate limiting**.

Limit:

```
50 requests per 60 seconds per IP
```

If the limit is exceeded:

```
HTTP 429 Too Many Requests
```

Response includes:

```
Retry-After header
```

---

# RabbitMQ Integration

Queue Name:

```
user_activities
```

Message format: JSON string.

Example publishing:

```javascript
channel.sendToQueue(
  "user_activities",
  Buffer.from(JSON.stringify(activity)),
  { persistent: true }
);
```

Consumer parsing:

```javascript
const data = JSON.parse(msg.content.toString());
```

Messages are acknowledged after processing:

```javascript
channel.ack(msg);
```

---

# Database Schema

Example MongoDB document:

```json
{
  "id": "uuid",
  "userId": "a1b2c3d4",
  "eventType": "user_login",
  "timestamp": "2023-10-27T10:00:00Z",
  "processedAt": "2023-10-27T10:00:05Z",
  "payload": {
    "device": "desktop"
  }
}
```

Fields:

| Field | Description |
|------|-------------|
| id | Unique event ID |
| userId | User identifier |
| eventType | Activity type |
| timestamp | Original event timestamp |
| processedAt | Processing timestamp |
| payload | Additional event metadata |

---

# Running the Application

## Prerequisites

Install:

- Docker
- Docker Compose

---

## Start the system

Run:

```
docker compose up --build
```

This will start:

- API service
- Consumer worker
- RabbitMQ
- MongoDB

---

# Service Ports

| Service | Port |
|--------|------|
| API | 3000 |
| RabbitMQ | 5672 |
| RabbitMQ UI | 15672 |
| MongoDB | 27017 |

---

# RabbitMQ Management UI

Open:

```
http://localhost:15672
```

Login credentials:

```
username: guest
password: guest
```

You can monitor:

- queues
- consumers
- message flow

---

# Example API Request

Using curl:

```
curl -X POST http://localhost:3000/api/v1/activities \
-H "Content-Type: application/json" \
-d "{\"userId\":\"123\",\"eventType\":\"login\",\"timestamp\":\"2026-03-06T10:00:00Z\",\"payload\":{\"device\":\"desktop\"}}"
```

Response:

```
{
  "message": "Activity queued"
}
```

---

# Health Check Endpoint

```
GET /health
```

Response:

```json
{
  "status": "OK"
}
```

Used by Docker health checks.

---

# Environment Variables

Example `.env.example`:

```
RABBITMQ_URL=amqp://guest:guest@localhost:5672
DATABASE_URL=mongodb://localhost:27017/activity_db
API_PORT=3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=50
```

---

# Testing

Run tests inside containers:

```
docker compose exec api npm test
docker compose exec consumer npm test
```

Tests cover:

- API validation
- message publishing
- consumer processing
- database insertion

---

# Error Handling

The system includes handling for:

- invalid input
- RabbitMQ connection failures
- message parsing errors
- database errors
- retry mechanisms

---

# Design Decisions

### Event-Driven Architecture
Decouples ingestion from processing, improving scalability.

### Durable Queue
Ensures messages are not lost during failures.

### Asynchronous Processing
Worker processes events independently from the API.

### Rate Limiting
Prevents abuse and protects system resources.

---

# Future Improvements

- Redis-based distributed rate limiting
- Dead letter queues
- activity analytics API
- monitoring with Prometheus
- centralized logging

---

# Conclusion

This project demonstrates a **scalable event-driven backend system** using modern technologies.  
It highlights asynchronous messaging, reliable event processing, rate limiting strategies, and containerized deployments commonly used in real-world distributed systems.