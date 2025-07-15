# Vida Motors CR - Car Rental System

## Project Overview

Vida Motors CR is a comprehensive car rental management system built for Costa Rica, featuring a customer-facing rental platform, admin management panel, and reseller interface. The system supports both USD and CRC currencies with real-time availability tracking and booking management.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                      │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15.3.5 Frontend (Vercel)                         │
│  ├── Customer Portal (Vehicle browsing & booking)          │
│  ├── Admin Panel (Fleet & booking management)              │
│  └── Reseller Interface (Commission-based sales)           │
└─────────────────────────────────────────────────────────────┘
                               │
                    RESTful API + WebSockets
                               │
┌─────────────────────────────────────────────────────────────┐
│                    OAUTH SERVICE                            │
├─────────────────────────────────────────────────────────────┤
│  Cloudflare Worker (Google OAuth)                          │
│  ├── Redirects to Google OAuth                             │
│  ├── Handles callback, issues JWT                          │
│  └── HTTP-only cookie management                           │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  Express.js API Server (Render)                            │
│  ├── JWT Authentication & Authorization                     │
│  ├── Vehicle Management                                     │
│  ├── Booking System with Real-time Updates                 │
│  ├── User Management                                        │
│  ├── Redis Cache (vehicles, sessions)                      │
│  └── Socket.IO for WebSocket connections                   │
└─────────────────────────────────────────────────────────────┘
                               │
                        Mongoose ODM
                               │
┌─────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE                         │
├─────────────────────────────────────────────────────────────┤
│  MongoDB Atlas                                              │
│  ├── Users (OAuth ID, email, role) - Indexed              │
│  ├── Vehicles (fleet with performance indexes)             │
│  └── Bookings (reservations with status tracking)          │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (vida-rentals-app)
- **Framework**: Next.js 15.3.5 with Turbopack
- **Runtime**: React 19.0.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom components
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Context API
- **Date Handling**: date-fns
- **HTTP Client**: Native Fetch API with custom wrapper

### Backend (vida-rentals-backend)
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5
- **Database ODM**: Mongoose 8.16.2
- **Authentication**: JWT with HTTP-only cookies (no password storage)
- **Caching**: Redis 7 for session management and data caching
- **Real-time**: Socket.IO for WebSocket connections
- **Security**: Helmet, CORS, Rate limiting, comprehensive error handling
- **Logging**: Morgan
- **Development**: Nodemon with ts-node
- **Testing**: Jest, Supertest, 80%+ coverage target

### OAuth Service (Cloudflare Worker)
- **Platform**: Cloudflare Workers
- **Authentication**: Google OAuth 2.0 integration
- **Security**: No password storage, secure token exchange
- **Deployment**: Wrangler CLI
- **Environment**: Serverless edge computing

### Database & Infrastructure
- **Database**: MongoDB Atlas (production), MongoDB 7.0 (Docker for development)
- **Caching**: Redis (Docker for development, Redis Cloud for production)
- **Container Management**: Docker Compose
- **Admin Interface**: mongo-express (development)
- **Performance**: Strategic indexing for optimal query performance

## Core Features

### 1. Vehicle Management
- **Fleet Inventory**: Complete vehicle catalog with categories (Economy, Compact, SUV, Luxury)
- **Pricing**: Dual currency support (USD/CRC) with automatic conversion
- **Availability**: Real-time booking calendar with date range blocking
- **Media**: Image storage and management
- **Specifications**: Detailed vehicle information (year, transmission, fuel type, etc.)

### 2. Booking System
- **Reservation Flow**: Multi-step booking process with validation
- **Pricing Calculation**: Dynamic pricing based on duration, vehicle type, and markups
- **Status Management**: Booking lifecycle (pending → confirmed → completed/cancelled)
- **Customer Information**: Contact details and special requirements
- **Commission Tracking**: Reseller commission calculation and reporting

### 3. User Management & Authentication
- **OAuth Integration**: Google OAuth 2.0 via Cloudflare Workers (no password storage)
- **Role-Based Access**: Customer, Admin, Reseller roles with different permissions
- **Authentication**: JWT-based with HTTP-only cookies for enhanced security
- **Session Management**: Redis-backed session storage
- **Profile Management**: User preferences, language, and currency settings
- **Reseller Features**: Commission rates, markup permissions, sales tracking
- **Security**: Zero password breach risk, XSS protection

### 4. Admin Panel
- **Dashboard**: Real-time booking overview and fleet status
- **Vehicle CRUD**: Add, edit, remove vehicles from fleet
- **Booking Management**: View, modify, and track all reservations with live updates
- **User Administration**: Manage customer and reseller accounts
- **Analytics**: Comprehensive reporting and statistics
- **Real-time Features**: WebSocket-powered live availability updates

### 5. Performance & Scalability
- **Caching Strategy**: Redis caching for frequently accessed vehicle data
- **Database Optimization**: Strategic MongoDB indexing for fast queries
- **Real-time Updates**: Socket.IO for live booking status and availability
- **CDN Integration**: Vercel edge network for global content delivery
- **Auto-scaling**: Cloudflare Workers and Render auto-scaling capabilities

## Project Structure

### Frontend Structure (`vida-rentals-app/`)
```
src/
├── app/                     # Next.js 15 app router
│   ├── admin/              # Admin panel routes
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── forms/              # Form components
│   ├── layout/             # Navigation and layout
│   ├── modals/             # Modal dialogs
│   ├── rental/             # Customer rental interface
│   └── ui/                 # Reusable UI primitives
├── contexts/               # React context providers
│   └── AuthContext.tsx     # Authentication state management
├── lib/                    # Utilities and configurations
│   ├── api/                # API client and endpoints
│   ├── data/               # Static data and constants
│   ├── hooks/              # Custom React hooks
│   ├── models/             # TypeScript interfaces
│   ├── types/              # Type definitions
│   └── utils/              # Helper functions
└── app/globals.css         # Global styles
```

### Backend Structure (`vida-rentals-backend/`)
```
src/
├── controllers/            # Request handlers
│   ├── auth.ts             # OAuth callback handling
│   ├── bookings.ts         # Booking management with real-time updates
│   ├── users.ts            # User operations
│   └── vehicles.ts         # Vehicle management with caching
├── middleware/             # Express middleware
│   ├── auth.ts             # JWT authentication & authorization
│   ├── error.ts            # Comprehensive error handling
│   └── rateLimiter.ts      # Rate limiting and security
├── models/                 # Mongoose schemas with indexes
│   ├── Booking.ts          # Booking data model
│   ├── User.ts             # User data model (OAuth-based)
│   └── Vehicle.ts          # Vehicle data model with performance indexes
├── routes/                 # API route definitions
│   ├── auth.ts             # OAuth callback routes
│   ├── bookings.ts         # Booking endpoints
│   ├── users.ts            # User management
│   └── vehicles.ts         # Vehicle endpoints
├── seed/                   # Database seeding
│   └── seedData.ts         # Sample data insertion
├── utils/                  # Utility functions
│   ├── cache.ts            # Redis caching utilities
│   ├── database.ts         # MongoDB connection
│   └── jwt.ts              # JWT token utilities
├── __tests__/              # Test suites
│   ├── auth.test.ts        # Authentication tests
│   ├── bookings.test.ts    # Booking endpoint tests
│   ├── vehicles.test.ts    # Vehicle management tests
│   └── mock-oauth.ts       # Mock OAuth server for testing
├── socket/                 # WebSocket handlers
│   └── bookingEvents.ts    # Real-time booking updates
└── server.ts               # Express application entry point
```

### OAuth Worker Structure (`vida-oauth-worker/`)
```
├── oauth-worker.js         # Cloudflare Worker OAuth handler
├── wrangler.toml          # Worker configuration
├── package.json           # Dependencies and scripts
└── __tests__/             # Worker test suite
    └── oauth.test.js      # OAuth flow testing
```

## Data Models

### User Schema (OAuth-based)
```typescript
interface IUser {
  oauthId: string;                  // OAuth provider user ID (Google sub)
  email: string;                    // Unique identifier from OAuth
  firstName: string;                // From OAuth profile
  lastName: string;                 // From OAuth profile
  role: 'admin' | 'customer' | 'reseller';
  phone?: string;
  language: 'en' | 'es';           // Bilingual support
  currency: 'USD' | 'CRC';         // Currency preference
  
  // Reseller-specific fields
  commissionRate?: number;          // Percentage commission
  totalCommissions?: number;        // Earned commissions
  isActive?: boolean;              // Account status
  canMarkup?: boolean;             // Markup permissions
  
  // Security note: No password field - OAuth eliminates password breach risk
}

// Mongoose schema with indexes for performance
UserSchema.index({ oauthId: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
```

### Vehicle Schema (Performance Optimized)
```typescript
interface IVehicle {
  name: string;                    // Vehicle display name
  category: string;                // Economy, Compact, SUV, Luxury
  year: number;
  make: string;
  model: string;
  transmission: 'manual' | 'automatic';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  seats: number;
  price: number;                   // USD daily rate
  pricecolones: number;           // CRC daily rate
  available: boolean;             // General availability
  bookedDates: BookedDate[];      // Reserved date ranges
  image: string;                  // Image URL/path
  features: string[];             // Vehicle amenities
  description: string;
}

// Performance indexes for fast queries
VehicleSchema.index({ category: 1, available: 1 });
VehicleSchema.index({ 'bookedDates.start': 1, 'bookedDates.end': 1 });
VehicleSchema.index({ price: 1 });
VehicleSchema.index({ name: 'text', description: 'text' }); // Text search
```

### Booking Schema (Real-time Optimized)
```typescript
interface IBooking {
  vehicleId: ObjectId;            // Reference to Vehicle
  userId: ObjectId;               // Reference to User (customer)
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  commission?: number;            // Reseller commission
  commissionRate?: number;        // Commission percentage
  totalCost: number;
  currency: 'USD' | 'CRC';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  resellerId?: ObjectId;          // Reference to reseller
  createdAt: Date;
  updatedAt: Date;
}

// Indexes for booking queries and real-time updates
BookingSchema.index({ vehicleId: 1, pickupDate: 1, returnDate: 1 });
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ resellerId: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ pickupDate: 1, returnDate: 1 }); // Date range queries
```

## Development Environment

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB & Redis (via Docker)
- Wrangler CLI (for Cloudflare Workers)
- Git

### Local Development Setup
```bash
# Clone repository
git clone <repository-url>
cd Vida

# Start MongoDB and Redis containers
docker-compose up -d

# Backend setup
cd vida-rentals-backend
npm install
npm run seed                    # Populate database with sample data
npm run dev                     # Start backend server (port 5000)

# Frontend setup (new terminal)
cd ../vida-rentals-app
npm install
npm run dev                     # Start frontend server (port 3000)

# OAuth Worker setup (new terminal)
cd ../vida-oauth-worker
npm install
wrangler dev                    # Start Worker (port 8787)
```

### Updated Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    ports:
      - '27017:27017'
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=secret
    volumes:
      - mongodb_data:/data/db
  
  redis:
    image: redis:7
    ports:
      - '6379:6379'
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
  
  mongo-express:
    image: mongo-express:latest
    ports:
      - '8081:8081'
    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
      - ME_CONFIG_MONGODB_ADMINPASSWORD=secret
      - ME_CONFIG_MONGODB_SERVER=mongodb
    depends_on:
      - mongodb

volumes:
  mongodb_data:
  redis_data:
```

### Environment Configuration
```env
# Backend (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vida-rentals
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:3000,http://localhost:8787

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_OAUTH_URL=http://localhost:8787/auth/google

# OAuth Worker (wrangler.toml)
[vars]
CLIENT_ID = "your-google-client-id"
CLIENT_SECRET = "your-google-client-secret"
REDIRECT_URI = "http://localhost:8787/auth/callback"
BACKEND_URL = "http://localhost:5000"
```

## API Endpoints

### Authentication (OAuth-based)
- `POST /api/auth/callback` - OAuth callback handler (receives user data from Worker)
- `GET /api/auth/profile` - Get user profile (requires JWT)
- `PUT /api/auth/profile` - Update user profile (requires JWT)
- `POST /api/auth/logout` - Logout (clears HTTP-only cookies)

### Vehicles (Cached for Performance)
- `GET /api/vehicles` - List all vehicles (Redis cached)
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create new vehicle (admin only)
- `PUT /api/vehicles/:id` - Update vehicle (admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (admin only)
- `GET /api/vehicles/search` - Search vehicles by text

### Bookings (Real-time Updates)
- `GET /api/bookings` - List bookings (admin/reseller)
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking (triggers WebSocket update)
- `PUT /api/bookings/:id` - Update booking (triggers WebSocket update)
- `DELETE /api/bookings/:id` - Cancel booking (triggers WebSocket update)
- `GET /api/bookings/stats` - Booking statistics (admin)

### WebSocket Events (Real-time Features)
- `booking:created` - New booking notification
- `booking:updated` - Booking status change
- `booking:cancelled` - Booking cancellation
- `availability:changed` - Vehicle availability update

## Testing Strategy

### Testing Tools & Framework
- **Backend**: Jest + Supertest for API endpoint testing
- **Frontend**: React Testing Library + Jest for component testing
- **Worker**: Wrangler testing for OAuth flow validation
- **Integration**: Docker-based testing environment
- **Coverage Target**: 80%+ code coverage across all components

### Backend Testing (`vida-rentals-backend/__tests__/`)
```typescript
// Example: Authentication flow testing
describe('OAuth Authentication', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    // Start mock OAuth server
  });

  it('should create user from OAuth callback', async () => {
    const response = await request(app)
      .post('/api/auth/callback')
      .send({
        oauthId: 'google-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      });
    
    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined(); // JWT cookie
  });
});

// Booking system testing with real-time events
describe('Booking Management', () => {
  it('should create booking and emit WebSocket event', async () => {
    const socketClient = io('http://localhost:5000');
    const bookingPromise = new Promise((resolve) => {
      socketClient.on('booking:created', resolve);
    });

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send(validBookingData);

    const socketEvent = await bookingPromise;
    expect(socketEvent).toHaveProperty('bookingId');
  });
});
```

### Frontend Testing (`vida-rentals-app/__tests__/`)
```typescript
// Component testing with authentication context
describe('VehicleBookingForm', () => {
  const mockUser = {
    email: 'test@example.com',
    role: 'customer',
    firstName: 'Test',
    lastName: 'User'
  };

  it('submits booking when user is authenticated', async () => {
    render(
      <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true }}>
        <VehicleBookingForm vehicleId="vehicle-123" />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/pickup date/i), {
      target: { value: '2025-08-01' }
    });
    fireEvent.click(screen.getByText(/book now/i));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/bookings'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
```

### OAuth Worker Testing (`vida-oauth-worker/__tests__/`)
```javascript
// Mock Google OAuth responses for testing
describe('OAuth Worker', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should handle OAuth callback and return user data', async () => {
    fetch
      .mockResolvedValueOnce({ // Token exchange
        json: () => Promise.resolve({ access_token: 'fake-token' })
      })
      .mockResolvedValueOnce({ // User info
        json: () => Promise.resolve({
          sub: 'google-123',
          email: 'test@example.com',
          given_name: 'Test',
          family_name: 'User'
        })
      });

    const request = new Request('http://localhost:8787/auth/callback?code=test-code');
    const response = await handleRequest(request);
    const data = await response.json();

    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe('test@example.com');
  });
});
```

### Testing Commands & Scripts
```bash
# Backend testing
cd vida-rentals-backend
npm run test                    # Run all tests
npm run test:watch             # Watch mode for development
npm run test:coverage          # Generate coverage report

# Frontend testing
cd vida-rentals-app
npm test                       # Interactive test runner
npm run test:coverage          # Coverage report

# Worker testing
cd vida-oauth-worker
npm test                       # Test OAuth flows

# Integration testing (all services)
docker-compose -f docker-compose.test.yml up -d
npm run test:integration       # Test with real database
```

### Mock Services for Local Testing
```typescript
// Mock OAuth server for development
// src/__tests__/mock-oauth.ts
import express from 'express';

const app = express();

// Mock Google OAuth endpoints
app.get('/o/oauth2/v2/auth', (req, res) => {
  const { redirect_uri } = req.query;
  res.redirect(`${redirect_uri}?code=mock-auth-code`);
});

app.post('/oauth2/token', (req, res) => {
  res.json({ access_token: 'mock-access-token' });
});

app.get('/oauth2/v1/userinfo', (req, res) => {
  res.json({
    sub: 'mock-user-123',
    email: 'test@example.com',
    given_name: 'Test',
    family_name: 'User'
  });
});

app.listen(3001, () => console.log('Mock OAuth server running on port 3001'));
```

### Testing Database Configuration
```yaml
# docker-compose.test.yml
version: '3.8'
services:
  mongodb-test:
    image: mongo:7.0
    ports:
      - '27018:27017'
    environment:
      - MONGO_INITDB_DATABASE=vida-rentals-test
    tmpfs:
      - /data/db  # In-memory database for faster tests
  
  redis-test:
    image: redis:7
    ports:
      - '6380:6379'
    tmpfs:
      - /data  # In-memory cache for tests
```

## Current Status & Goals

### ✅ Completed Features
1. **Database Setup**: MongoDB in Docker with sample data and Redis caching
2. **Core Backend**: Express API with comprehensive error handling
3. **Frontend Integration**: Next.js app with optimized API consumption
4. **Vehicle Display**: Homepage with cached vehicle data
5. **Admin Panel**: Full CRUD operations with real-time updates
6. **Booking System**: Complete reservation functionality with WebSocket support
7. **Authentication**: Temporary JWT system (pending OAuth migration)
8. **Dual Currency**: USD/CRC support with automatic conversion
9. **Performance Optimization**: Database indexing and Redis caching

### 🔄 Current Migration Tasks
1. **OAuth Implementation**: Replace password auth with Google OAuth via Cloudflare Workers
2. **HTTP-only Cookies**: Migrate from localStorage tokens to secure cookies
3. **Real-time Features**: Implement Socket.IO for live booking updates
4. **Comprehensive Testing**: Add Jest/Supertest test suites with 80% coverage
5. **Production Deployment**: Migration to Render/Vercel/Atlas stack

### 🎯 Immediate Goals (Next Sprint)
1. **Security Upgrade**: Complete OAuth migration and remove password storage
2. **Testing Implementation**: Full test suite with mock services
3. **Performance Enhancement**: Redis caching for vehicle data
4. **Error Handling**: Standardized API error responses
5. **Real-time Updates**: WebSocket implementation for live availability

### 🚀 Future Enhancements (Roadmap)
1. **Payment Integration**: Stripe/PayPal with Costa Rican payment methods
2. **Email Notifications**: Automated booking confirmations and reminders
3. **Advanced Analytics**: Revenue reporting and fleet utilization metrics
4. **Mobile App**: React Native application with offline capabilities
5. **Multi-language**: Complete Spanish localization
6. **File Management**: Cloud-based vehicle image storage
7. **AI Features**: Smart pricing and demand prediction
8. **Third-party Integrations**: Calendar sync and CRM integration

## Development Guidelines

### Code Standards
- **TypeScript**: Strict typing throughout
- **ESLint**: Next.js recommended configuration
- **Naming**: camelCase for variables, PascalCase for components
- **File Structure**: Feature-based organization
- **API Design**: RESTful principles with consistent responses

### Security Considerations
- **Authentication**: JWT with secure HTTP-only cookies (planned)
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for production domains
- **Rate Limiting**: API protection against abuse
- **Helmet**: Security headers for Express

### Performance Optimization
- **Next.js**: Server-side rendering and static generation
- **Database**: Mongoose indexes on frequently queried fields
- **Caching**: API response caching (planned)
- **Images**: Optimized image loading and compression

## Deployment Strategy

### Local Development Environment (Docker-based)
- **Frontend**: localhost:3000 (Next.js dev server with Turbopack)
- **Backend**: localhost:5000 (Express with nodemon)
- **OAuth Worker**: localhost:8787 (Wrangler dev server)
- **Database**: localhost:27017 (Docker MongoDB 7.0)
- **Cache**: localhost:6379 (Docker Redis 7)
- **Database Admin**: localhost:8081 (mongo-express)

### Production Environment
- **Frontend**: Cloudflare Pages (Next.js with global edge CDN)
- **Backend**: Render (Node.js with auto-scaling)
- **OAuth Service**: Cloudflare Workers (global edge deployment)
- **Database**: MongoDB Atlas (M10+ cluster with auto-scaling)
- **Cache**: Redis Cloud (managed Redis instance)
- **Monitoring**: Render metrics + Cloudflare Analytics

### Deployment Pipeline (CI/CD)
```yaml
# .github/workflows/deploy.yml
name: Deploy Vida Rentals
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Test backend
      - name: Test Backend
        run: |
          cd vida-rentals-backend
          npm ci
          npm run test:coverage
        env:
          MONGODB_URI: mongodb://localhost:27017/vida-test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret
      
      # Test frontend
      - name: Test Frontend
        run: |
          cd vida-rentals-app
          npm ci
          npm run test:coverage
      
      # Test Worker
      - name: Test OAuth Worker
        run: |
          cd vida-oauth-worker
          npm ci
          npm test

  deploy-worker:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Worker
        run: |
          cd vida-oauth-worker
          npm ci
          npx wrangler publish
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"

  deploy-frontend:
    needs: [test, deploy-worker, deploy-backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Pages
        run: |
          cd vida-rentals-app
          npm ci
          npm run build
          npx wrangler pages deploy out --project-name vida-rentals-app
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Environment Configuration

#### Local Development
```env
# vida-rentals-backend/.env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vida-rentals
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-key
CORS_ORIGIN=http://localhost:3000,http://localhost:8787

# vida-rentals-app/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_OAUTH_URL=http://localhost:8787/auth/google

# vida-oauth-worker/wrangler.toml
[vars]
CLIENT_ID = "your-google-client-id"
CLIENT_SECRET = "your-google-client-secret"
REDIRECT_URI = "http://localhost:8787/auth/callback"
BACKEND_URL = "http://localhost:5000"
```

#### Production Configuration
```env
# Backend (Render Environment Variables)
NODE_ENV=production
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/vida-rentals
REDIS_URL=rediss://user:password@redis-cloud-endpoint:port
JWT_SECRET=production-jwt-secret
CORS_ORIGIN=https://vida-rentals-app.pages.dev,https://oauth-worker.yourdomain.workers.dev

# Frontend (Cloudflare Pages Environment Variables)
NEXT_PUBLIC_API_URL=https://vida-backend.onrender.com/api
NEXT_PUBLIC_OAUTH_URL=https://oauth-worker.yourdomain.workers.dev/auth/google

# Worker (Cloudflare Environment Variables)
CLIENT_ID=your-production-google-client-id
CLIENT_SECRET=your-production-google-client-secret
REDIRECT_URI=https://oauth-worker.yourdomain.workers.dev/auth/callback
BACKEND_URL=https://vida-backend.onrender.com
FRONTEND_URL=https://vida-rentals-app.pages.dev
```

### Database Setup

#### MongoDB Atlas Configuration
1. **Cluster Creation**: M10+ tier for production workloads
2. **Security**: IP whitelist for Render and Cloudflare Workers
3. **Database**: vida-rentals with collections (users, vehicles, bookings)
4. **Indexes**: Performance indexes as defined in data models
5. **Backup**: Automated daily backups with 7-day retention

#### Redis Cloud Configuration
1. **Instance**: 100MB+ for production caching
2. **Security**: Password authentication and TLS encryption
3. **Location**: Same region as Render backend for low latency
4. **Use Cases**: Vehicle data caching, session storage

### Monitoring & Observability
- **Backend**: Render built-in metrics + custom logging
- **Frontend**: Cloudflare Web Analytics + Pages Analytics
- **Worker**: Cloudflare Workers Analytics
- **Database**: MongoDB Atlas monitoring + alerts
- **CDN**: Cloudflare global network analytics
- **Uptime**: Cloudflare uptime monitoring

## Contributing

### Git Workflow
1. Feature branches from main
2. Pull requests for code review
3. Automated testing before merge
4. Semantic versioning for releases

### Issue Tracking
- Bug reports with reproduction steps
- Feature requests with user stories
- Documentation improvements
- Performance optimizations

---

## Summary

The Vida Motors CR car rental system represents a modern, secure, and scalable solution for Costa Rican car rental operations. Key architectural decisions include:

- **Zero-password security** through Google OAuth integration
- **Edge-first approach** with Cloudflare Workers for authentication
- **Performance optimization** via Redis caching and strategic database indexing  
- **Real-time capabilities** through WebSocket integration
- **Comprehensive testing** with 80% coverage target
- **Production-ready deployment** on Cloudflare Pages/Render/Atlas stack
- **Global CDN** with Cloudflare's edge network for optimal performance

The system eliminates common security vulnerabilities while providing excellent user experience through modern web technologies and Costa Rican market-specific features like dual-currency support. The Cloudflare-first approach ensures optimal performance and security across all components.

---

*Last Updated: 2025-01-08*  
*Architecture Version: 2.0.0*  
*Status: OAuth Migration Phase*  
*Next Review: 2025-01-15*