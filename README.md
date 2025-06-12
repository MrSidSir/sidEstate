# SidEstate - Real Estate Platform

A modern, full-stack real estate platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to buy, sell, and rent properties with advanced search capabilities and user authentication.

## 🏠 Features

### Core Features

- **User Authentication** - Sign up, sign in, and secure authentication with JWT
- **Property Listings** - Create, read, update, and delete property listings
- **Advanced Search** - Filter properties by type, price, location, and amenities
- **User Profiles** - Manage personal information and view owned listings
- **Image Upload** - Multiple image support for property listings
- **Responsive Design** - Modern UI with Tailwind CSS

### Property Management

- **Property Types** - Support for sale and rent properties
- **Detailed Information** - Name, description, address, pricing, bedrooms, bathrooms
- **Amenities** - Parking availability, furnished status
- **Discount Pricing** - Support for offer prices
- **Image Gallery** - Multiple property images with Swiper carousel

### Authentication & Security

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Protected Routes** - Private routes for authenticated users
- **Cookie Management** - Secure session management

## 🛠️ Tech Stack

### Frontend

- **React 19.1.0** - Modern React with latest features
- **Redux Toolkit** - State management with modern Redux
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Firebase** - Authentication and file storage integration
- **Swiper** - Modern touch slider for image galleries
- **React Icons** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie parsing middleware

### Development Tools

- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
Sstate/
├── api/                    # Backend API
│   ├── controllers/        # Route controllers
│   │   ├── user.model.js  # User schema
│   │   └── listing.model.js # Property listing schema
│   ├── routes/            # API routes
│   │   ├── auth.route.js  # Authentication routes
│   │   ├── user.route.js  # User management routes
│   │   └── listing.route.js # Property listing routes
│   ├── utils/             # Utility functions
│   └── index.js           # Express server entry point
├── sidstate/              # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # React page components
│   │   │   ├── Home.jsx   # Homepage with featured listings
│   │   │   ├── SignIn.jsx # User login page
│   │   │   ├── SignUp.jsx # User registration page
│   │   │   ├── Profile.jsx # User profile management
│   │   │   ├── CreateListing.jsx # Create new property listing
│   │   │   ├── UpdateListing.jsx # Edit existing listing
│   │   │   ├── Listing.jsx # Property detail page
│   │   │   ├── Search.jsx # Property search page
│   │   │   └── About.jsx  # About page
│   │   ├── redux/         # Redux state management
│   │   ├── assets/        # Static assets
│   │   ├── Firebase.js    # Firebase configuration
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React app entry point
│   ├── public/            # Public assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── package.json           # Backend dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Firebase account (for image storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Sstate
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd sidstate
   npm install
   cd ..
   ```

4. **Environment Setup**

   - Update MongoDB URI in `api/index.js`
   - Update JWT secret in `api/index.js`
   - Configure Firebase in `sidstate/src/Firebase.js`

5. **Start the development servers**

   **Backend (from root directory):**

   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

   **Frontend (from sidstate directory):**

   ```bash
   cd sidstate
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`

## 📊 Database Schema

### User Model

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String (default profile image),
  timestamps: true
}
```

### Listing Model

```javascript
{
  name: String (required),
  description: String (required),
  address: String (required),
  regularPrice: Number (required),
  discountPrice: Number (required),
  bathroom: Number (required),
  bedroom: Number (required),
  parking: Boolean (required),
  furnished: Boolean (required),
  type: String (required - 'sale' or 'rent'),
  offer: Boolean (required),
  imageUrls: [String] (required),
  userRef: String (required - user ID),
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /signup` - Register new user
- `POST /signin` - User login
- `POST /signout` - User logout

### User Routes (`/api/user`)

- `POST /update/:id` - Update user profile
- `DELETE /delete/:id` - Delete user account
- `GET /listings/:id` - Get user's listings

### Listing Routes (`/api/listing`)

- `POST /create` - Create new listing
- `DELETE /delete/:id` - Delete listing
- `POST /update/:id` - Update listing
- `GET /get/:id` - Get specific listing
- `GET /get` - Search listings with filters

## 🎨 Frontend Pages

- **Home** - Featured listings and search functionality
- **Sign In/Up** - User authentication
- **Profile** - User account management and listing overview
- **Create/Update Listing** - Property listing management
- **Listing Detail** - Individual property view with image gallery
- **Search** - Advanced property search with filters
- **About** - Company information

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes for authenticated users
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- Secure cookie handling

## 🎯 Key Features Implementation

### Authentication Flow

1. User registration/login with email and password
2. JWT token generation and storage
3. Protected route middleware
4. Persistent authentication with Redux

### Property Management

1. Image upload with Firebase integration
2. Form validation for property details
3. CRUD operations for listings
4. Advanced search with multiple filters

### State Management

- Redux Toolkit for global state
- Redux Persist for state persistence
- User authentication state
- Listing management state

## 📝 Available Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern React and Node.js best practices
- UI design inspired by modern real estate platforms
- Authentication patterns following JWT best practices
- Responsive design with Tailwind CSS utilities
