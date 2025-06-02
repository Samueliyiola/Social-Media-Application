
# Real-Time Social Media Backend

This is a Node.js backend for a real-time social media application. It supports user authentication, post creation, likes, comments, bookmarks, following/unfollowing users, real-time messaging, and notifications.

## 🚀 Features

- ✅ User authentication with JWT
- 📸 Image upload with Cloudinary
- 📝 Create, like, comment, and bookmark posts
- 🔁 Follow/Unfollow users
- 📩 Real-time chat with Socket.IO
- 👁 Mark messages as seen
- 📶 Track online/offline user status
- 📤 Upload media in chat messages
- 🧪 Validation and controller abstraction for cleaner code

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Real-time:** Socket.IO
- **Database:** MongoDB (Mongoose)
- **Cloud Storage:** Cloudinary
- **Authentication:** JWT
- **Validation:** Joi (via `controllerHandler`)
- **File Handling:** Multer (in-memory)

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Samueliyiola/social-media-application.git
cd social-media-backend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up `.env` file

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the server

```bash
npm run dev
```

---

## 📡 Socket.IO Events

### Client emits:

* `send-message`: `{ receiverId, text?, mediaFiles? }`
* `mark-seen`: `{ messageId }`

### Server emits:

* `receive-message`: `Message`
* `message-sent`: `Message`
* `message-error`: `String`
* `user-online`: `userId`
* `user-offline`: `userId`

---

## 📨 REST API Overview

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### User

* `GET /api/users/:username`
* `GET /api/users/:username/posts`
* `POST /api/users/:id/follow`
* `GET /api/users/:id/followers`
* `GET /api/users/:id/following`

### Posts

* `POST /api/posts` – Create post (with images)
* `GET /api/posts/:id` – View single post
* `DELETE /api/posts/:id` – Delete post
* `POST /api/posts/:id/like` - Like Post
* `GET /api/posts/:id/likes` - See Post Likes
* `POST /api/posts/:id/bookmark` - Bookmark a post
* `POST /api/posts/:id/comments` -Comment on a post
* `GET /api/posts/:id/comments` -View Comments on a post
* `DELETE /api/posts/comments/:id`  -Delete a comment
* `POST /api/posts/comments/:id/like` - Like a comment
* `GET /api/posts/comments/:id/likes`  - See likes on a comment
* `GET /api/posts/timeline`  - See a User's timeline

### Messages

* `GET /api/messages/:receiverId`
* `POST /api/messages/:id/mark-seen`

---

## 🧪 Testing Real-Time Features Without Frontend

Use [Postman WebSocket](https://blog.postman.com/introducing-websocket-request-support-in-postman/) to test:

1. Connect to the server:

   ```
   ws://localhost:5000
   ```

2. Set auth token in `auth` payload:

   ```json
   {
     "token": "Bearer <your_token_here>"
   }
   ```

3. Emit `send-message`:

   ```json
   {
     "receiverId": "user123",
     "text": "Hello!",
     "mediaFiles": []
   }
   ```

---

## 🛠 Future Improvements

* Add pagination to followers, comments, and timeline
* Notification service for likes/comments
* Support for group messaging
* Mobile app integration
* Admin panel for moderation

---

## 📄 License

MIT License. Feel free to fork and contribute!

---

## 👨‍💻 Author

Built with ❤️ by Samuel (https://github.com/Samueliyiola)

