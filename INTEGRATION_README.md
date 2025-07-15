# Vida Motors - Database Integration

This document explains how to run the integrated Vida Motors system with the database backend.

## Architecture Overview

- **Frontend**: "Vida adding DB" - React/TypeScript application
- **Backend**: VidaRentals/render - Node.js/Express API with MongoDB
- **Database**: MongoDB with vehicle, user, and booking data

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **npm** or **yarn**

## Setup Instructions

### 1. Start MongoDB
Ensure MongoDB is running on `mongodb://localhost:27017/vida-rentals`

### 2. Setup and Start Backend

```bash
cd "VidaRentals/render"
npm install
npm run seed    # Seeds the database with initial data
npm run dev     # Starts the backend server on port 5000
```

### 3. Setup and Start Frontend

```bash
cd "Vida adding DB"
npm install
npm run dev     # Starts the frontend on port 5173
```

## Default Credentials

### Admin Access
- Email: `admin@vidarentals.com`
- Password: `admin123`

### API Endpoints

The backend provides the following endpoints:

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle (admin only)
- `PUT /api/vehicles/:id` - Update vehicle (admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (admin only)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## Features Integrated

### Frontend Features
- ✅ Vehicle inventory displays data from database
- ✅ Featured vehicles section connected to DB
- ✅ Admin panel for vehicle management
- ✅ Authentication system
- ✅ Real-time CRUD operations

### Backend Features
- ✅ Vehicle model with proper schema
- ✅ User authentication with JWT
- ✅ Admin role-based access
- ✅ CORS configured for frontend
- ✅ Data validation and error handling

## Data Flow

1. **Vehicle Display**: Frontend fetches vehicles from `/api/vehicles`
2. **Admin Operations**: Authenticated admin can create/update/delete vehicles
3. **Real-time Updates**: Changes are immediately reflected in the frontend
4. **Error Handling**: Proper error messages and loading states

## File Structure

```
Vida adding DB/
├── src/
│   ├── lib/
│   │   ├── api.ts              # Axios configuration
│   │   ├── vehicleService.ts   # Vehicle API calls
│   │   └── authService.ts      # Authentication API calls
│   ├── hooks/
│   │   └── useVehicles.ts      # Vehicle data hook
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── components/
│   │   └── AdminLogin.tsx      # Admin login component
│   └── pages/
│       └── admin/
│           └── VehicleManagement.tsx # Admin vehicle management

VidaRentals/render/
├── src/
│   ├── models/
│   │   └── Vehicle.ts          # Vehicle MongoDB model
│   ├── routes/
│   │   └── vehicles.ts         # Vehicle API routes
│   ├── controllers/
│   │   └── vehicles.ts         # Vehicle controllers
│   └── seed/
│       └── seedData.ts         # Database seeding
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vida-rentals
JWT_SECRET=vida-rentals-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Testing the Integration

1. **Start both servers** (backend on 5000, frontend on 5173)
2. **Visit** `http://localhost:5173`
3. **View vehicles** - Should display data from database
4. **Admin login** - Go to `http://localhost:5173/admin`
5. **Manage vehicles** - Add/edit/delete vehicles through admin panel

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend .env has correct CORS_ORIGIN
2. **Database connection**: Check MongoDB is running
3. **Authentication errors**: Verify JWT_SECRET is set
4. **Port conflicts**: Ensure ports 5000 and 5173 are available

### Reset Database
```bash
cd "VidaRentals/render"
npm run seed
```

## Next Steps

To deploy this system:

1. **Frontend**: Deploy to Cloudflare Pages
2. **Backend**: Deploy to Render (as configured)
3. **Database**: Use MongoDB Atlas for production
4. **Environment**: Update API URLs for production

## Key Integration Points

- **Data Transformation**: Backend vehicle model is transformed to match frontend interface
- **Authentication**: JWT-based admin authentication
- **Real-time Updates**: Frontend refetches data after mutations
- **Error Handling**: Comprehensive error handling throughout the stack
- **Loading States**: Proper loading indicators for better UX