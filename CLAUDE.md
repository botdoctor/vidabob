We are building this Project. We are going to deploy it to cloudflare pages. We are going to tie it into mongodb. Make sure the project works with this architechture. We will deploy the render folder to render for the backend

---

## Research Query

Why the fuck are there two front ends

*Session: c98623354a80c73cbdde58202436ac07 | Generated: 7/11/2025, 7:19:29 PM*

### Analysis Summary

# Codebase Analysis Report: Frontend Architecture

This report addresses the presence of two distinct "frontend" components within the codebase, clarifying their purposes and architectural roles.

## High-Level Architecture

The project utilizes a **monorepo** structure, containing two primary application layers: a **Back End** and a **Front End**. The user's observation of "two frontends" likely refers to the dedicated **Front End** application and a server-side rendering or administrative interface component within the **Back End**.

### **Front End** Application

The primary user-facing application is located in the [Front End/](Front End/) directory. This is a **React.js** application, as indicated by its `package.json` dependencies and the presence of `.tsx` files in its [src/](Front End/src/) directory.

*   **Purpose:** This application serves as the main client-side interface for users interacting with the VidaMotors platform. It handles user authentication, vehicle browsing, contact forms, and potentially other user-facing features.
*   **Internal Parts:**
    *   [Components/](Front End/src/components/): Reusable UI components such as [VehicleCard](Front End/src/components/VehicleCard.tsx), [Header](Front End/src/components/Header.tsx), and [Footer](Front End/src/components/Footer.tsx).
    *   [Pages/](Front End/src/pages/): Top-level views for different routes, including [Home](Front End/src/pages/Home.tsx), [Inventory](Front End/src/pages/Inventory.tsx), [Contact](Front End/src/pages/Contact.tsx), and administrative/reseller specific pages like [AdminLayout](Front End/src/pages/admin/AdminLayout.tsx) and [ResellerDashboard](Front End/src/pages/reseller/ResellerDashboard.tsx).
    *   [Contexts/](Front End/src/contexts/): Provides global state management, such as [AuthContext](Front End/src/contexts/AuthContext.tsx) for user authentication and [LanguageContext](Front End/src/contexts/LanguageContext.tsx) for internationalization.
    *   [Lib/](Front End/src/lib/): Contains API service integrations (e.g., [api.ts](Front End/src/lib/api.ts), [authService.ts](Front End/src/lib/authService.ts)) for communication with the **Back End** API.
*   **External Relationships:** Communicates with the **Back End** API (located in [Back End/](Back End/)) to fetch data, perform authentication, and submit user actions.

### **Back End** Application (with potential "rendering" capabilities)

The **Back End** application, located in the [Back End/](Back End/) directory, is a **Node.js** application using **TypeScript**. While primarily an API server, the presence of a `render/` directory within its `src/` suggests it might also handle server-side rendering or serve specific administrative/internal web interfaces.

*   **Purpose:** The core responsibility of the **Back End** is to provide a robust API for the **Front End** application, manage data persistence (likely with MongoDB, given `mongo-init.js`), handle business logic, and potentially serve specific web pages or assets.
*   **Internal Parts:**
    *   [Controllers/](Back End/src/controllers/): Handles incoming requests and orchestrates responses (e.g., [auth.ts](Back End/src/controllers/auth.ts), [vehicles.ts](Back End/src/controllers/vehicles.ts)).
    *   [Models/](Back End/src/models/): Defines data structures and interacts with the database (e.g., [User.ts](Back End/src/models/User.ts), [Vehicle.ts](Back End/src/models/Vehicle.ts)).
    *   [Routes/](Back End/src/routes/): Defines API endpoints (e.g., [auth.ts](Back End/src/routes/auth.ts), [vehicles.ts](Back End/src/routes/vehicles.ts)).
    *   [Utils/](Back End/src/utils/): Contains utility functions (e.g., [database.ts](Back End/src/utils/database.ts) for database connection, [jwt.ts](Back End/src/utils/jwt.ts) for JSON Web Token handling).
    *   [render/](Back End/render/src/): This directory, specifically, suggests a component responsible for rendering views or serving static assets that are distinct from the main **Front End** application. It contains its own [controllers/](Back End/render/src/controllers/), [data/](Back End/render/src/data/), [middleware/](Back End/render/src/middleware/), [models/](Back End/render/src/models/), [routes/](Back End/render/src/routes/), and [utils/](Back End/render/src/utils/) directories, implying a self-contained web application or a server-side rendering module. This could be for an internal admin panel, a legacy interface, or a specific set of pages rendered directly by the server.
*   **External Relationships:** Exposes a RESTful API consumed by the **Front End** application. Interacts with a database (e.g., MongoDB).

## Conclusion: Why Two "Frontends"

The two "frontends" are distinct in their primary purpose and implementation:

1.  **`Front End/`**: This is the **main client-side application** built with React, providing the interactive user experience. It's a Single Page Application (SPA) that consumes APIs from the **Back End**.
2.  **`Back End/render/src/`**: This component within the **Back End** likely serves a **server-side rendered interface** or a separate, possibly administrative, web application. This could be for:
    *   **Server-Side Rendering (SSR):** To improve initial page load performance or SEO for certain pages.
    *   **Administrative Panel:** A separate, simpler interface for internal management that doesn't require the full complexity of the main React application.
    *   **Legacy System Integration:** A part of the system that predates the main React frontend and is still maintained.

Without further investigation into the code within `Back End/render/src/`, the exact nature of its "frontend" capabilities remains speculative, but it clearly indicates a separate web-serving component distinct from the primary React application.

<codebase_context>

# CodeViz Research Context

> **Note**: This file contains research context from ALL active CodeViz sessions.

> **Active Sessions**: 1 research reports

> **Generated**: 7/11/2025, 7:21:05 PM

## Research Query

Why the fuck are there two front ends

*Session: c98623354a80c73cbdde58202436ac07 | Generated: 7/11/2025, 7:21:05 PM*

### Analysis Summary

# Codebase Analysis Report: Frontend Architecture

This report addresses the presence of two distinct "frontend" components within the codebase, clarifying their purposes and architectural roles.

## High-Level Architecture

The project utilizes a **monorepo** structure, containing two primary application layers: a **Back End** and a **Front End**. The user's observation of "two frontends" likely refers to the dedicated **Front End** application and a server-side rendering or administrative interface component within the **Back End**.

### **Front End** Application

The primary user-facing application is located in the [Front End/](Front End/) directory. This is a **React.js** application, as indicated by its `package.json` dependencies and the presence of `.tsx` files in its [src/](Front End/src/) directory.

*   **Purpose:** This application serves as the main client-side interface for users interacting with the VidaMotors platform. It handles user authentication, vehicle browsing, contact forms, and potentially other user-facing features.
*   **Internal Parts:**
    *   [Components/](Front End/src/components/): Reusable UI components such as [VehicleCard](Front End/src/components/VehicleCard.tsx), [Header](Front End/src/components/Header.tsx), and [Footer](Front End/src/components/Footer.tsx).
    *   [Pages/](Front End/src/pages/): Top-level views for different routes, including [Home](Front End/src/pages/Home.tsx), [Inventory](Front End/src/pages/Inventory.tsx), [Contact](Front End/src/pages/Contact.tsx), and administrative/reseller specific pages like [AdminLayout](Front End/src/pages/admin/AdminLayout.tsx) and [ResellerDashboard](Front End/src/pages/reseller/ResellerDashboard.tsx).
    *   [Contexts/](Front End/src/contexts/): Provides global state management, such as [AuthContext](Front End/src/contexts/AuthContext.tsx) for user authentication and [LanguageContext](Front End/src/contexts/LanguageContext.tsx) for internationalization.
    *   [Lib/](Front End/src/lib/): Contains API service integrations (e.g., [api.ts](Front End/src/lib/api.ts), [authService.ts](Front End/src/lib/authService.ts)) for communication with the **Back End** API.
*   **External Relationships:** Communicates with the **Back End** API (located in [Back End/](Back End/)) to fetch data, perform authentication, and submit user actions.

### **Back End** Application (with potential "rendering" capabilities)

The **Back End** application, located in the [Back End/](Back End/) directory, is a **Node.js** application using **TypeScript**. While primarily an API server, the presence of a `render/` directory within its `src/` suggests it might also handle server-side rendering or serve specific administrative/internal web interfaces.

*   **Purpose:** The core responsibility of the **Back End** is to provide a robust API for the **Front End** application, manage data persistence (likely with MongoDB, given `mongo-init.js`), handle business logic, and potentially serve specific web pages or assets.
*   **Internal Parts:**
    *   [Controllers/](Back End/src/controllers/): Handles incoming requests and orchestrates responses (e.g., [auth.ts](Back End/src/controllers/auth.ts), [vehicles.ts](Back End/src/controllers/vehicles.ts)).
    *   [Models/](Back End/src/models/): Defines data structures and interacts with the database (e.g., [User.ts](Back End/src/models/User.ts), [Vehicle.ts](Back End/src/models/Vehicle.ts)).
    *   [Routes/](Back End/src/routes/): Defines API endpoints (e.g., [auth.ts](Back End/src/routes/auth.ts), [vehicles.ts](Back End/src/routes/vehicles.ts)).
    *   [Utils/](Back End/src/utils/): Contains utility functions (e.g., [database.ts](Back End/src/utils/database.ts) for database connection, [jwt.ts](Back End/src/utils/jwt.ts) for JSON Web Token handling).
    *   [render/](Back End/render/src/): This directory, specifically, suggests a component responsible for rendering views or serving static assets that are distinct from the main **Front End** application. It contains its own [controllers/](Back End/render/src/controllers/), [data/](Back End/render/src/data/), [middleware/](Back End/render/src/middleware/), [models/](Back End/render/src/models/), [routes/](Back End/render/src/routes/), and [utils/](Back End/render/src/utils/) directories, implying a self-contained web application or a server-side rendering module. This could be for an internal admin panel, a legacy interface, or a specific set of pages rendered directly by the server.
*   **External Relationships:** Exposes a RESTful API consumed by the **Front End** application. Interacts with a database (e.g., MongoDB).

## Conclusion: Why Two "Frontends"

The two "frontends" are distinct in their primary purpose and implementation:

1.  **`Front End/`**: This is the **main client-side application** built with React, providing the interactive user experience. It's a Single Page Application (SPA) that consumes APIs from the **Back End**.
2.  **`Back End/render/src/`**: This component within the **Back End** likely serves a **server-side rendered interface** or a separate, possibly administrative, web application. This could be for:
    *   **Server-Side Rendering (SSR):** To improve initial page load performance or SEO for certain pages.
    *   **Administrative Panel:** A separate, simpler interface for internal management that doesn't require the full complexity of the main React application.
    *   **Legacy System Integration:** A part of the system that predates the main React frontend and is still maintained.

Without further investigation into the code within `Back End/render/src/`, the exact nature of its "frontend" capabilities remains speculative, but it clearly indicates a separate web-serving component distinct from the primary React application.



</codebase_context>

---

## Research Query

Can you make a map of my code very in depth

*Session: 712ae4c90db0e0f9da91519366792183 | Generated: 7/11/2025, 7:27:19 PM*

### Analysis Summary

# Codebase Map: VidaMotors

This document provides a comprehensive map of the `VidaMotors` codebase, detailing its high-level architecture, core components, their purposes, internal structures, and external relationships.

## High-Level Architecture

The `VidaMotors` project is structured as a full-stack application, primarily composed of three distinct services: a **Back End** API, a **Front End** user interface, and an **OAuth Worker**. These services are designed to operate independently but communicate to deliver the application's functionality. The entire system is containerized using [Docker](docker-compose.yml) for consistent deployment and environment management. Data persistence is handled by a MongoDB database, initialized via [mongo-init.js](mongo-init.js).

## Back End

The **Back End** service, located in the [Back End/](Back End/) directory, is responsible for handling all server-side logic, API endpoints, database interactions, and business rules. It is built using Node.js and TypeScript.

### Purpose
The primary purpose of the **Back End** is to expose a set of RESTful APIs that the [Front End](#front-end) consumes, manage user authentication and authorization, and persist application data in the MongoDB database.

### Internal Structure

The core logic of the **Back End** resides within the [Back End/src/](Back End/src/) directory, organized into several key modules:

*   **[server.ts](Back End/src/server.ts)**: The main entry point of the application, responsible for setting up the Express server, connecting to the database, and registering routes and middleware.
*   **[controllers/](Back End/src/controllers/)**: Contains the business logic for handling incoming HTTP requests. Each controller typically interacts with models to perform operations and sends responses back to the client.
    *   [auth.ts](Back End/src/controllers/auth.ts): Handles user authentication and authorization.
    *   [availability.ts](Back End/src/controllers/availability.ts): Manages vehicle availability.
    *   [bookings.ts](Back End/src/controllers/bookings.ts): Manages vehicle booking operations.
    *   [contacts.ts](Back End/src/controllers/contacts.ts): Handles contact form submissions.
    *   [settings.ts](Back End/src/controllers/settings.ts): Manages application settings.
    *   [users.ts](Back End/src/controllers/users.ts): Manages user-related operations.
    *   [vehicles.ts](Back End/src/controllers/vehicles.ts): Manages vehicle data.
*   **[middleware/](Back End/src/middleware/)**: Contains functions that process requests before they reach the route handlers.
    *   [auth.ts](Back End/src/middleware/auth.ts): Middleware for authenticating requests (e.g., JWT verification).
    *   [error.ts](Back End/src/middleware/error.ts): Centralized error handling middleware.
*   **[models/](Back End/src/models/)**: Defines the Mongoose schemas and models for the MongoDB database, representing the application's data structures.
    *   [Booking.ts](Back End/src/models/Booking.ts): Schema for vehicle bookings.
    *   [Contact.ts](Back End/src/models/Contact.ts): Schema for contact messages.
    *   [Settings.ts](Back End/src/models/Settings.ts): Schema for application settings.
    *   [User.ts](Back End/src/models/User.ts): Schema for user accounts.
    *   [Vehicle.ts](Back End/src/models/Vehicle.ts): Schema for vehicle listings.
    *   [VehicleNew.ts](Back End/src/models/VehicleNew.ts): Potentially an updated or alternative vehicle schema.
*   **[routes/](Back End/src/routes/)**: Defines the API endpoints and maps them to the corresponding controller functions.
    *   [auth.ts](Back End/src/routes/auth.ts): Routes for authentication.
    *   [availability.ts](Back End/src/routes/availability.ts): Routes for vehicle availability.
    *   [bookings.ts](Back End/src/routes/bookings.ts): Routes for bookings.
    *   [contacts.ts](Back End/src/routes/contacts.ts): Routes for contacts.
    *   [settings.ts](Back End/src/routes/settings.ts): Routes for settings.
    *   [users.ts](Back End/src/routes/users.ts): Routes for users.
    *   [vehicles.ts](Back End/src/routes/vehicles.ts): Routes for vehicles.
*   **[seed/](Back End/src/seed/)**: Contains scripts for populating the database with initial or test data.
    *   [addNewVehicles.ts](Back End/src/seed/addNewVehicles.ts): Script to add new vehicles.
    *   [migrateVehicles.ts](Back End/src/seed/migrateVehicles.ts): Script for migrating vehicle data.
    *   [seedData.ts](Back End/src/seed/seedData.ts): General data seeding script.
*   **[utils/](Back End/src/utils/)**: Provides utility functions used across the application.
    *   [cache.ts](Back End/src/utils/cache.ts): Utility for caching data.
    *   [database.ts](Back End/src/utils/database.ts): Handles the connection to the MongoDB database.
    *   [jwt.ts](Back End/src/utils/jwt.ts): Utility for JSON Web Token (JWT) operations.

### External Relationships
The **Back End** communicates with the [Front End](#front-end) via HTTP/HTTPS requests and interacts directly with a MongoDB database for data storage and retrieval.

## Front End

The **Front End** service, located in the [Front End/](Front End/) directory, is the user-facing part of the application, built with React and TypeScript, likely using Vite as a build tool.

### Purpose
The primary purpose of the **Front End** is to provide an intuitive and interactive user interface for browsing vehicles, making bookings, contacting the business, and managing administrative tasks. It consumes data and services provided by the [Back End](#back-end).

### Internal Structure

The core of the **Front End** application is within the [Front End/src/](Front End/src/) directory:

*   **[main.tsx](Front End/src/main.tsx)**: The entry point of the React application, responsible for rendering the root component.
*   **[App.tsx](Front End/src/App.tsx)**: The main application component, typically handling routing and global layout.
*   **[components/](Front End/src/components/)**: Contains reusable UI components used across different pages.
    *   [About.tsx](Front End/src/components/About.tsx): About section component.
    *   [AdminLogin.tsx](Front End/src/components/AdminLogin.tsx): Admin login form.
    *   [Contact.tsx](Front End/src/components/Contact.tsx): Contact form component.
    *   [FeaturedVehicles.tsx](Front End/src/components/FeaturedVehicles.tsx): Displays featured vehicles.
    *   [Footer.tsx](Front End/src/components/Footer.tsx): Application footer.
    *   [Header.tsx](Front End/src/components/Header.tsx): Application header/navigation.
    *   [Hero.tsx](Front End/src/components/Hero.tsx): Hero section component.
    *   [LanguageToggle.tsx](Front End/src/components/LanguageToggle.tsx): Component for switching languages.
    *   [Layout.tsx](Front End/src/components/Layout.tsx): Defines the overall page layout.
    *   [Logo.tsx](Front End/src/components/Logo.tsx): Application logo component.
    *   [ProtectedRoute.tsx](Front End/src/components/ProtectedRoute.tsx): Component for protecting routes based on authentication status.
    *   [ResellerLogin.tsx](Front End/src/components/ResellerLogin.tsx): Reseller login form.
    *   [SimpleResellerLogin.tsx](Front End/src/components/SimpleResellerLogin.tsx): Simplified reseller login.
    *   [VehicleCard.tsx](Front End/src/components/VehicleCard.tsx): Displays a single vehicle's information.
    *   [VidaMotorsBenefits.tsx](Front End/src/components/VidaMotorsBenefits.tsx): Displays benefits of VidaMotors.
*   **[contexts/](Front End/src/contexts/)**: Manages global state using React Context API.
    *   [AppContext.tsx](Front End/src/contexts/AppContext.tsx): General application context.
    *   [AuthContext.tsx](Front End/src/contexts/AuthContext.tsx): Manages user authentication state.
    *   [LanguageContext.tsx](Front End/src/contexts/LanguageContext.tsx): Manages language settings.
*   **[data/](Front End/src/data/)**: Contains static or mock data used within the application.
    *   [contact.ts](Front End/src/data/contact.ts): Contact-related data.
    *   [services.ts](Front End/src/data/services.ts): Data for services offered.
    *   [vehicles.ts](Front End/src/data/vehicles.ts): Static vehicle data (possibly for initial display or testing).
*   **[hooks/](Front End/src/hooks/)**: Custom React hooks for encapsulating reusable logic.
    *   [useBookings.ts](Front End/src/hooks/useBookings.ts): Hook for managing booking-related logic.
    *   [useVehicles.ts](Front End/src/hooks/useVehicles.ts): Hook for managing vehicle-related logic.
*   **[lib/](Front End/src/lib/)**: Contains client-side API service modules for interacting with the backend.
    *   [api.ts](Front End/src/lib/api.ts): Base API client configuration.
    *   [authService.ts](Front End/src/lib/authService.ts): Service for authentication API calls.
    *   [availabilityService.ts](Front End/src/lib/availabilityService.ts): Service for availability API calls.
    *   [bookingService.ts](Front End/src/lib/bookingService.ts): Service for booking API calls.
    *   [contactService.ts](Front End/src/lib/contactService.ts): Service for contact API calls.
    *   [resellerService.ts](Front End/src/lib/resellerService.ts): Service for reseller API calls.
    *   [vehicleService.ts](Front End/src/lib/vehicleService.ts): Service for vehicle API calls.
*   **[pages/](Front End/src/pages/)**: Top-level components that represent different views or routes in the application.
    *   [About.tsx](Front End/src/pages/About.tsx): About Us page.
    *   [Contact.tsx](Front End/src/pages/Contact.tsx): Contact Us page.
    *   [Home.tsx](Front End/src/pages/Home.tsx): Homepage.
    *   [Inventory.tsx](Front End/src/pages/Inventory.tsx): Vehicle inventory listing page.
    *   [Rentals.tsx](Front End/src/pages/Rentals.tsx): Rentals specific page.
    *   [SellCar.tsx](Front End/src/pages/SellCar.tsx): Page for selling a car.
    *   [VehicleDetail.tsx](Front End/src/pages/VehicleDetail.tsx): Detailed view for a single vehicle.
    *   **[admin/](Front End/src/pages/admin/)**: Pages specific to the admin dashboard.
        *   [AdminLayout.tsx](Front End/src/pages/admin/AdminLayout.tsx): Layout for admin pages.
        *   [Analytics.tsx](Front End/src/pages/admin/Analytics.tsx): Analytics dashboard.
        *   [CustomerManagement.tsx](Front End/src/pages/admin/CustomerManagement.tsx): Customer management section.
        *   [Dashboard.tsx](Front End/src/pages/admin/Dashboard.tsx): Admin main dashboard.
        *   [RentalManagement.tsx](Front End/src/pages/admin/RentalManagement.tsx): Rental management section.
        *   [ResellerManagement.tsx](Front End/src/pages/admin/ResellerManagement.tsx): Reseller management section.
        *   [Settings.tsx](Front End/src/pages/admin/Settings.tsx): Admin settings page.
        *   [VehicleManagement.tsx](Front End/src/pages/admin/VehicleManagement.tsx): Vehicle management section.
    *   **[reseller/](Front End/src/pages/reseller/)**: Pages specific to the reseller portal.
        *   [ResellerDashboard.tsx](Front End/src/pages/reseller/ResellerDashboard.tsx): Reseller main dashboard.
        *   [ResellerLayout.tsx](Front End/src/pages/reseller/ResellerLayout.tsx): Layout for reseller pages.
        *   [ResellerVehicles.tsx](Front End/src/pages/reseller/ResellerVehicles.tsx): Reseller's vehicle listings.
*   **[styles/](Front End/src/styles/)**: Contains global or specific CSS styles.
    *   [datepicker-overrides.css](Front End/src/styles/datepicker-overrides.css): Styles for overriding datepicker components.
*   **[types/](Front End/src/types/)**: TypeScript type definitions.
    *   [index.ts](Front End/src/types/index.ts): Centralized type definitions.

### External Relationships
The **Front End** communicates with the [Back End](#back-end) by making HTTP requests to its API endpoints to fetch and send data.

## Oauth Worker

The **Oauth Worker** service, located in the [Oauth Worker/](Oauth Worker/) directory, appears to be a separate worker process dedicated to handling OAuth authentication flows.

### Purpose
Its primary purpose is to manage the complexities of OAuth authentication, potentially offloading this task from the main backend service or acting as an intermediary with OAuth providers.

### Internal Structure
The core logic is contained within the [oauth-worker.js](Oauth Worker/oauth-worker.js) file. The [wrangler.toml](Oauth Worker/wrangler.toml) file suggests it might be deployed as a Cloudflare Worker.

### External Relationships
The **Oauth Worker** likely interacts with external OAuth providers (e.g., Google, Facebook) and may communicate with the [Back End](#back-end) to register or update user information after successful authentication.

---

## Research Query

Can you make me a detailed map of the backend

*Session: 04ba6f63ef5d09825738476b5a895ec1 | Generated: 7/11/2025, 7:30:08 PM*

### Analysis Summary

# Backend Architecture Map

The backend of the VidaMotors application is primarily built with Node.js and TypeScript, following a common MVC-like pattern. It handles API requests, interacts with the database, and manages business logic for various functionalities like authentication, vehicle management, bookings, and user administration.

## High-Level Architecture

The backend application's entry point is [server.ts](Back%20End/src/server.ts), which sets up the Express.js server, connects to the database, and registers the API routes. The core components are organized into distinct directories, each with a specific responsibility:

*   **Routes**: Defines the API endpoints and directs incoming requests to the appropriate controller functions.
*   **Controllers**: Contains the business logic that processes requests, interacts with models, and prepares responses.
*   **Models**: Defines the data schemas and provides an interface for interacting with the MongoDB database.
*   **Middleware**: Functions that execute in the request-response cycle, handling tasks like authentication, error handling, and request parsing.
*   **Utils**: Provides helper functions for common tasks such as database connection, JWT token management, and caching.

```typescript
// Simplified representation of server.ts
import express from 'express';
import connectDB from './utils/database'; // Establishes DB connection
import authRoutes from './routes/auth'; // Imports route modules

const app = express();
connectDB(); // Connect to MongoDB

app.use('/api/auth', authRoutes); // Register routes
// ... other route registrations
```
The [server.ts](Back%20End/src/server.ts) file orchestrates the setup, bringing together the database connection, middleware, and routes to form the operational API.

## Core Components

### Routes

The [routes](Back%20End/src/routes/) directory defines the API endpoints for different functionalities. Each file in this directory typically corresponds to a major resource or feature and uses Express.js's `Router` to define HTTP methods (GET, POST, PUT, DELETE) and link them to specific controller functions.

*   **Purpose**: To map incoming HTTP requests to the correct handler functions in the controllers.
*   **Internal Parts**:
    *   [auth.ts](Back%20End/src/routes/auth.ts): Handles user authentication routes (login, register).
    *   [vehicles.ts](Back%20End/src/routes/vehicles.ts): Manages routes for vehicle-related operations (add, retrieve, update, delete vehicles).
    *   [bookings.ts](Back%20End/src/routes/bookings.ts): Defines routes for booking management.
    *   [users.ts](Back%20End/src/routes/users.ts): Provides routes for user management.
    *   [contacts.ts](Back%20End/src/routes/contacts.ts): Manages routes for contact form submissions.
    *   [settings.ts](Back%20End/src/routes/settings.ts): Handles routes for application settings.
    *   [availability.ts](Back%20End/src/routes/availability.ts): Manages routes related to vehicle availability.
*   **External Relationships**: Routes directly interact with [controllers](Back%20End/src/controllers/) by calling their functions to process requests.

### Controllers

The [controllers](Back%20End/src/controllers/) directory contains the business logic for handling API requests. Each controller function receives a request, processes it (often by interacting with models), and sends back a response.

*   **Purpose**: To encapsulate the application's business logic, process incoming requests, and prepare responses.
*   **Internal Parts**:
    *   [auth.ts](Back%20End/src/controllers/auth.ts): Contains functions for user registration, login, and token generation.
    *   [vehicles.ts](Back%20End/src/controllers/vehicles.ts): Implements logic for creating, retrieving, updating, and deleting vehicle records.
    *   [bookings.ts](Back%20End/src/controllers/bookings.ts): Handles the logic for creating, managing, and retrieving bookings.
    *   [users.ts](Back%20End/src/controllers/users.ts): Contains functions for managing user accounts (e.g., creating, updating, deleting users).
    *   [contacts.ts](Back%20End/src/controllers/contacts.ts): Processes contact form submissions.
    *   [settings.ts](Back%20End/src/controllers/settings.ts): Manages application settings.
    *   [availability.ts](Back%20End/src/controllers/availability.ts): Implements logic for checking and managing vehicle availability.
*   **External Relationships**: Controllers interact with [models](Back%20End/src/models/) to perform database operations and may use functions from [utils](Back%20End/src/utils/) for common tasks. They receive requests from [routes](Back%20End/src/routes/) and send responses back.

### Models

The [models](Back%20End/src/models/) directory defines the Mongoose schemas for the application's data. Each file represents a collection in the MongoDB database and specifies the structure, data types, and validation rules for documents within that collection.

*   **Purpose**: To define the structure and behavior of data stored in the MongoDB database.
*   **Internal Parts**:
    *   [User.ts](Back%20End/src/models/User.ts): Defines the schema for user accounts.
    *   [Vehicle.ts](Back%20End/src/models/Vehicle.ts): Defines the schema for vehicle listings.
    *   [Booking.ts](Back%20End/src/models/Booking.ts): Defines the schema for vehicle bookings.
    *   [Contact.ts](Back%20End/src/models/Contact.ts): Defines the schema for contact form submissions.
    *   [Settings.ts](Back%20End/src/models/Settings.ts): Defines the schema for application settings.
    *   [VehicleNew.ts](Back%20End/src/models/VehicleNew.ts): Potentially an updated or alternative schema for vehicles.
*   **External Relationships**: Models are primarily used by [controllers](Back%20End/src/controllers/) to interact with the database (e.g., `User.find()`, `Vehicle.create()`).

### Middleware

The [middleware](Back%20End/src/middleware/) directory contains functions that execute in the request-response cycle before the request reaches the final route handler. These functions can perform tasks like authentication, logging, and error handling.

*   **Purpose**: To intercept and process requests before they reach the main route handlers, or to handle errors.
*   **Internal Parts**:
    *   [auth.ts](Back%20End/src/middleware/auth.ts): Contains middleware for authenticating users (e.g., verifying JWT tokens).
    *   [error.ts](Back%20End/src/middleware/error.ts): Provides a centralized error handling middleware.
*   **External Relationships**: Middleware functions are typically applied globally in [server.ts](Back%20End/src/server.ts) or to specific routes in the [routes](Back%20End/src/routes/) files. They can modify the request or response objects, or terminate the request-response cycle.

### Utils

The [utils](Back%20End/src/utils/) directory contains various helper functions that are used across different parts of the backend.

*   **Purpose**: To provide reusable utility functions for common tasks.
*   **Internal Parts**:
    *   [database.ts](Back%20End/src/utils/database.ts): Contains the function to establish a connection to the MongoDB database.
    *   [jwt.ts](Back%20End/src/utils/jwt.ts): Provides functions for generating and verifying JSON Web Tokens.
    *   [cache.ts](Back%20End/src/utils/cache.ts): Likely contains functions for caching data.
*   **External Relationships**: Utility functions are imported and used by [controllers](Back%20End/src/controllers/), [middleware](Back%20End/src/middleware/), and [server.ts](Back%20End/src/server.ts).

### Seed

The [seed](Back%20End/src/seed/) directory contains scripts for populating the database with initial data or migrating existing data.

*   **Purpose**: To manage initial data setup and database migrations.
*   **Internal Parts**:
    *   [seedData.ts](Back%20End/src/seed/seedData.ts): A script for seeding initial data into the database.
    *   [migrateVehicles.ts](Back%20End/src/seed/migrateVehicles.ts): A script for migrating vehicle data.
    *   [addNewVehicles.ts](Back%20End/src/seed/addNewVehicles.ts): A script for adding new vehicles to the database.
*   **External Relationships**: These scripts are typically run manually or as part of a deployment process and interact directly with the database via the [models](Back%20End/src/models/).

This detailed map provides a comprehensive overview of the backend's structure, components, and their interrelationships, serving as a guide for navigation and understanding the codebase.

