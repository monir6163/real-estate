# Real Estate Client

A modern full-stack real estate platform built with Next.js, TypeScript, Tailwind CSS, and Shadcn/ui. This client application provides a comprehensive property management system with role-based access control for admins, agents, and users.

# Credentials for Testing

- **Admin**
  - Email:monirhossain6163@gmail.com
  - Password:123456789

- **Agent**
  - Email:ultrasrealpro@gmail.com
  - Password:12345678

- **user**
  - Email:monirdev1@gmail.com
  - Password:123456789

# Live Demo

- **Frontend:** [https://real-estate-client-drab-three.vercel.app](https://real-estate-client-drab-three.vercel.app)
- **Backend API:** [https://real-state-server-cyan.vercel.app](https://real-state-server-cyan.vercel.app)

## 🚀 Features

### Public Features

- **Property Browsing** - Browse all available properties with advanced search filters
- **Featured Properties** - View curated featured properties on the homepage
- **Property Details** - Complete property information with images and reviews
- **User Authentication** - Secure registration and login with email verification

### User Features

- **Dashboard** - Personal dashboard with quick stats (total booked, properties count)
- **Bookings Management** - View and manage property bookings
- **Reviews** - Leave and view reviews on properties
- **Favorites** - Save favorite properties for later

### Agent Features

- **Property Management** - Create, update, and manage properties
- **Agent Dashboard** - Stats on pending/approved bookings, reviews, and ratings
- **Owner Bookings** - View all bookings for owned properties
- **Property Listings** - Organize and manage property listings

### Admin Features

- **Dashboard** - Complete overview with system-wide statistics
- **User Management** - View, search, filter, and manage user accounts
  - Activate/deactivate users (except other admins)
  - Role-based filtering
  - User status tracking (ACTIVE, INACTIVE, SUSPENDED)
- **Property Management**
  - View all properties with search and filtering
  - Toggle featured status for properties
  - Manage property listings
- **Booking Management** - View and manage all system bookings
- **User Status Control** - Change user status with real-time updates

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 16.1.6
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui Components
- **Authentication:** Custom auth-client with JWT
- **State Management:** React Hooks (useState, useTransition)
- **Server Actions:** NextJS Server Actions for API calls
- **Icons:** lucide-react
- **Notifications:** Sonner Toast
- **HTTP Client:** Native Fetch API

## 📁 Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── (commonLayout)/          # Common layout routes
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── verify-email/        # Email verification
│   │   └── verify-request/      # Verification request
│   ├── (dashboardLayout)/       # Protected dashboard routes
│   │   ├── @admin/              # Admin panel
│   │   │   └── admin-dashboard/
│   │   │       ├── all-users/   # User management
│   │   │       ├── all-properties/  # Property management
│   │   │       └── all-bookings/    # Booking management
│   │   ├── @agent/              # Agent dashboard
│   │   ├── @user/               # User dashboard
│   │   └── layout.tsx           # Dashboard layout
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── actions/                      # Server actions
│   ├── properties.ts            # Property-related actions
│   └── users.ts                 # User-related actions
├── components/
│   ├── PropertyCard.tsx          # Property display component
│   ├── layout/                   # Layout components
│   │   ├── Navbar.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── modules/                  # Feature-specific components
│   └── ui/                       # Shadcn/ui components
├── constants/
│   ├── Roles.ts                 # Role definitions
│   └── UserStatus.ts            # User status constants
├── hooks/                        # Custom React hooks
├── lib/
│   ├── auth-client.ts           # Authentication utilities
│   └── utils.ts                 # Helper functions
├── providers/                    # Context/Theme providers
├── routes/                       # Route definitions by role
├── schema/                       # Zod validation schemas
├── store/                        # Client-side state (Zustand)
├── types/                        # TypeScript type definitions
└── helper/                       # Utility helpers
```

## 🔐 Role-Based Access Control

### Admin

- Full system access
- User management (activate/deactivate/suspend users)
- Property feature toggling
- Booking oversight
- Cannot be deactivated by other admins

### Agent

- Create and manage own properties
- View bookings for own properties
- Track reviews and ratings
- Limited to own property listings

### User

- Browse properties
- Book properties
- Leave reviews
- Manage bookings
- Save favorites

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🚀 Server Actions

### Properties

- `getAllProperties(filters?)` - Fetch all properties with optional filters
- `getPropertyById(id)` - Get single property details
- `getFeaturedProperties(filters?)` - Get featured properties
- `createProperty(formData)` - Create new property (Agent only)
- `updateProperty(id, formData)` - Update property (Agent only)
- `deleteProperty(id)` - Delete property (Admin/Agent)
- `togglePropertyFeatured(id)` - Toggle featured status (Admin only)

### Users

- `getAllUsers()` - Fetch all users (Admin only)
- `updateUserStatus(id, status)` - Change user status (Admin only)

## 🎨 UI Components (from Shadcn/ui)

- Badge - Status/category display
- Button - Interactive buttons with variants
- Card - Content containers
- Input - Text input fields
- Dialog/Sheet - Modal interactions
- And many more...

## 📝 Key Constants

### UserStatus

```typescript
export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
```

### Roles

```typescript
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  AGENT: "AGENT",
} as const;
```

## 🔄 API Integration

All API calls go through server actions at `/src/actions/`. The backend API URL is configured via `NEXT_PUBLIC_API_URL` environment variable.

Example API endpoints:

- `GET /api/v1/properties` - Get all properties
- `GET /api/v1/properties/featured` - Get featured properties
- `POST /api/v1/properties` - Create property (Agent only)
- `PATCH /api/v1/properties/featured/:id` - Toggle featured (Admin only)
- `GET /api/v1/users` - Get all users (Admin only)
- `PATCH /api/v1/users/:id` - Update user status (Admin only)

## 🎯 Getting Started

1. **Setup Environment:**

   ```bash
   cp .env.example .env.local
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **Run Development Server:**

   ```bash
   pnpm dev
   ```

4. **Open Browser:**
   ```
   http://localhost:3000
   ```

## 📚 Features Walkthrough

### Admin Dashboard

- Navigate to `/admin-dashboard` (admin users only)
- View system statistics
- Manage users, properties, and bookings

### Agent Dashboard

- Navigate to `/agent-dashboard` (agent users only)
- Create and manage properties
- Track bookings and reviews

### User Dashboard

- Navigate to `/user-dashboard` (regular users)
- View bookings and statistics
- Manage favorites

## 🐛 Error Handling

- Toast notifications for user feedback
- Error pages for 404 and server errors
- Form validation with Zod schemas
- Type-safe error responses

## 🔐 Security Features

- JWT-based authentication
- Protected routes by role
- Server-side action authentication
- Secure API communication
- Environment variable protection

## 🚀 Deployment

Deployed on Vercel with:

```bash
pnpm build
vercel --prod
```

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.
