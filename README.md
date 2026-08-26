# FINWISDOM 💰

### Learn • Plan • Grow

FinWisdom is a full-stack financial blogging platform where users can learn about personal finance, read financial articles, create their own blog posts, and interact through comments.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Secure password hashing
- Create blog posts
- Edit blog posts
- Delete blog posts
- View all financial articles
- View individual articles
- Comment on articles
- Category-based blog posts
- My Posts section
- Logout functionality
- RESTful APIs
- MySQL database integration
- Financial learning resources
- Financial calculator

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Postman
- Git & GitHub

## 📁 Project Structure

```text
FinWisdom/
│
├── client/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── create-post.html
│   ├── edit-post.html
│   ├── my-posts.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── main.js
│       ├── login.js
│       ├── register.js
│       ├── create-post.js
│       ├── edit-post.js
│       └── my-posts.js
│
├── server/
│   ├── server.js
│   ├── db.js
│   │
│   ├── middleware/
│   │   └── authenticateToken.js
│   │
│   └── routes/
│       ├── authRoutes.js
│       ├── postRoutes.js
│       ├── commentRoutes.js
│       └── categoryRoutes.js
│
├── .gitignore
├── package.json
└── README.md
