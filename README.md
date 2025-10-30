# Alrabie Real Estate - React + Node.js

A modern real estate application built with React + Vite frontend and Node.js backend.

## 🚀 Features

- **Modern React Frontend** with Vite for fast development
- **Node.js Backend** with Express and SQLite
- **Real-time Property Listings** with advanced filtering
- **User Authentication** with JWT tokens
- **Property Management** for agents and admins
- **Lead Management System** for customer inquiries
- **Responsive Design** with Tailwind CSS
- **Image Galleries** with modal views
- **Advanced Search & Filtering**

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Context API

### Backend
- Node.js
- Express.js
- SQLite3
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup (Express API)

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Copy the example and modify as needed
cp .env.example .env
```

4. Initialize database:
```bash
npm run init-db
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3003`

### Frontend Setup (Next.js 14)

1. Navigate to Next.js frontend directory:
```bash
cd frontend-next
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3003/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 Default Credentials

After running `npm run init-db`, you can use these credentials:

- **Admin**: admin@alrabie.ae / admin123
- **Agent**: sarah@alrabie.ae / agent123

## 📁 Project Structure

```
alrabie-real-estate-react/
├── backend/
│   ├── config.js
│   ├── database/
│   │   ├── db.js
│   │   └── alrabie_real_estate.db
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Lead.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── users.js
│   │   └── leads.js
│   ├── scripts/
│   │   └── init-db.js
│   ├── package.json
│   └── server.js
├── frontend-next/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── next.config.js
│   └── package.json
└── README.md
```

## 🚀 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=3003
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3003/api
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Properties
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (admin/agent)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Leads
- `GET /api/leads` - Get all leads (admin/agent)
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead status

## 🎨 Features Overview

### Property Management
- Add, edit, and delete properties
- Multiple image uploads
- Advanced filtering and search
- Property details with galleries

### User Management
- Role-based access (admin, agent, client)
- User authentication and authorization
- Profile management

### Lead Management
- Express interest forms
- Lead tracking and management
- Contact information collection

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Build the application
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables for production

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email info@alrabie.ae or create an issue in the repository.
