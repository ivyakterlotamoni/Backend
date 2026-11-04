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
## Installation

1. Clone the repository:

   `git clone https://github.com/ivyakterlotamoni/Backend.git`

2. Go to the project folder:

   `cd Backend`

3. Install dependencies:

   `npm install`

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

Replace the placeholder values with your own configuration. Never share your secret keys publicly.

## Run the Project

Start the development server:

`npm run dev`

For production:

`npm start`

The backend server runs at:

`http://localhost:8000`

## License

This project was created for educational purposes.