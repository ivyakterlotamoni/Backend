# Serve Together - Backend

Serve Together is a community event management platform backend. It provides APIs to create, view, update, delete, and join volunteer events.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JavaScript
- Better Auth
- JWT Authentication

## Project Purpose

The purpose of this backend is to manage volunteer events and allow authenticated users to participate in community service activities.
## API Endpoints

Base URL: `http://localhost:8000/events`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | Get all upcoming events |
| GET | `/events/:id` | Get event details |
| POST | `/events` | Create a new event |
| POST | `/events/:id/join` | Join an event |
| GET | `/events/joined/:email` | Get joined events |
| PUT | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event |

## Authentication

Protected API routes require a valid JWT token.

Include the token in the request header:

`Authorization: Bearer YOUR_JWT_TOKEN`

Users can create, update, delete, and join events after successful authentication.