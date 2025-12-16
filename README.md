# Department of AI & DS Portal

A comprehensive web application for the Department of Artificial Intelligence and Data Science, featuring student dashboards, event management, question banks, and administrative tools.

## 🚀 Features

### Public Features
- **Dashboard**: Overview of department statistics, recent updates, and quick access to key features
- **Events**: Browse and view department events and activities
- **Question Bank**: Access previous year question papers and study materials
- **Association Members**: View profiles of department association members
- **Leaderboards**: Track student performance and achievements
- **Projects**: Showcase of ongoing and completed projects
- **Achievements**: Department and student accomplishments
- **Connect**: Networking and communication tools

### Protected Features
- **Posts**: Internal announcements and communications (requires authentication)

### Admin Panel
- **Event Management**: Create, edit, and delete events
- **Question Paper Uploads**: Manage and organize question paper uploads

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (if using database)
- **Backend API** running (see Backend Setup)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
# Add other environment variables as needed
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will start on `http://localhost:5173` (or the port specified by Vite)

### Production Build

```bash
npm run build
npm run preview
```

## 🌐 Accessing the Application

### Public Routes (No Authentication Required)

- **Home/Dashboard**: `http://localhost:5173/`
- **Events**: `http://localhost:5173/events`
- **Leaderboards**: `http://localhost:5173/leaderboards`
- **Achievements**: `http://localhost:5173/achievements`
- **Connect**: `http://localhost:5173/connect`
- **Projects**: `http://localhost:5173/projects`
- **Question Bank**: `http://localhost:5173/question-bank`
- **Association Members**: `http://localhost:5173/association-members`

### Authentication Routes

- **Login**: `http://localhost:5173/login`
- **Signup**: `http://localhost:5173/signup`

### Protected Routes (Authentication Required)

- **Posts**: `http://localhost:5173/posts`

### Admin Panel 🔐

- **Admin Dashboard**: `http://localhost:5173/adminpage`
- **Manage Events**: `http://localhost:5173/adminpage`
- **Manage QP Uploads**: `http://localhost:5173/adminpage/manage-uploads`

> **Note**: Admin routes may require additional authentication. Ensure you have admin credentials.

## 🔧 Backend Setup

### Running the Backend Server

```bash
cd backend
npm install
npm start
```

Default backend port: `http://localhost:5000`

### API Endpoints

#### Events API
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

#### Question Papers API
- `GET /api/uploads` - Get all uploads
- `POST /api/uploads` - Upload new question paper (admin)
- `DELETE /api/uploads/:id` - Delete upload (admin)

#### Authentication API
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Verify token

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── EventsAdminPage.jsx
│   │   ├── ManageUploads.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Page components
│   │   ├── EventsPage.jsx
│   │   ├── PostsPage.jsx
│   │   ├── QuestionBank.jsx
│   │   ├── AssociationMembers.jsx
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   ├── assets/             # Images and static files
│   ├── App.jsx             # Main app component
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── public/                 # Public assets
├── backend/                # Backend server
└── README.md
```

## 🎨 Technologies Used

### Frontend
- **React** - UI framework
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (if applicable)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users sign up or log in through `/login` or `/signup`
2. Token is stored in localStorage
3. Protected routes check for valid token
4. Token is sent with API requests in Authorization header

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Notes

### Important Configuration

- **Admin Access**: Ensure your backend validates admin privileges for admin routes
- **CORS**: Configure CORS in backend to allow requests from frontend origin
- **File Uploads**: Question paper uploads may require multer or similar middleware

### Common Issues

**Issue**: API calls failing
- **Solution**: Check VITE_API_URL in .env file and ensure backend is running

**Issue**: Authentication not persisting
- **Solution**: Verify localStorage is being used correctly and tokens are not expired

## 📄 License


## 👥 Team

Department of Artificial Intelligence and Data Science

## 📧 Contact

---

**Made with ❤️ by the AI & DS Department**