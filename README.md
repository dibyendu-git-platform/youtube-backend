# YouTube Clone Backend

This is a simple backend for a YouTube clone application. It provides RESTful APIs for user authentication, video uploads, comments, and likes.

## Features

- User registration and login (JWT authentication)
- Video upload and streaming
- Commenting on videos
- Like/dislike functionality

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/youtube-backend.git
    cd youtube-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables in a `.env` file.

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/videos` - Upload a video
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/:id/comments` - Add a comment
- `POST /api/videos/:id/like` - Like a video

## License

MIT