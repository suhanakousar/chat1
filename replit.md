# UnifyChat - Real-Time Multilingual Chat Application

## Overview

UnifyChat is a real-time group chat web application that automatically translates messages into each participant's preferred language. The application enables seamless cross-language communication using WebSocket connections for instant messaging and Azure AI services for translation and speech-to-text capabilities.

The system consists of a React frontend (Vite + Tailwind CSS) and a Node.js/Express backend with Socket.IO for real-time communication. Messages are stored in their original language and translated on-demand for each recipient based on their language preference.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 19 with Vite as the build tool
- **Styling:** Tailwind CSS with custom design system (primary, secondary, accent color schemes)
- **State Management:** React Redux for global state, React Hook Form for form handling
- **Real-time Communication:** Socket.IO client for WebSocket connections
- **Routing:** React Router DOM v7 for navigation
- **Animations:** Framer Motion for UI transitions

**Design Patterns:**
- Component-based architecture with reusable UI components (Button, Input, Card, Modal, Badge, Avatar)
- Custom styling system with utility classes and design tokens defined in CSS variables
- Responsive design with mobile-first approach using Tailwind breakpoints
- Dark mode support with CSS class-based theming

**Key Frontend Features:**
- Google OAuth integration using `@react-oauth/google`
- JWT token decoding and session management
- Toast notifications for user feedback using `react-toastify`
- Speech-to-text integration using Microsoft Cognitive Services Speech SDK
- File upload capabilities with visual feedback

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js framework
- **Database ORM:** Prisma Client for type-safe database operations
- **Real-time:** Socket.IO for WebSocket server implementation
- **Authentication:** Passport.js with Google OAuth2 strategy, JWT for session tokens
- **File Handling:** Multer for file uploads with size limits (10MB) and type validation

**Design Patterns:**
- RESTful API design for HTTP endpoints
- WebSocket rooms for chat organization
- Middleware-based request processing (CORS, session, authentication)
- Controller-based route handling separating business logic from routing
- Service layer pattern for external API integrations (Azure services)

**Database Schema (Prisma-managed):**
- **User:** Stores user profiles (email, given_name, profile_picture, password for manual signup)
- **ChatRoom:** Room metadata (name, description, admin_id, avatar_color, avatar_text, last_message)
- **Message:** Chat messages (content, created_by, chat_id, timestamps)
- **ChatRoomRead:** Tracks read/unread status per user per room
- **Member relationships:** Tracks room membership with status (pending, approved, rejected)

**Authentication Flow:**
- Google OAuth2 for social login with UUID v5 generation for consistent user IDs
- JWT-based session tokens with configurable expiration
- Manual signup/login with bcrypt password hashing
- Passport session serialization for OAuth flows

**Real-time Communication:**
- Socket.IO rooms map to chat rooms
- Authentication via handshake with userId
- Events: `joinRoom`, `send-message`, `receive-message`, `disconnect`
- Messages broadcast to room members except sender

**API Structure:**
- `/auth/*` - User authentication (signup, login, Google OAuth callbacks)
- `/rooms/*` - Chat room CRUD operations, membership management
- `/rooms/:roomId/messages` - Message creation and retrieval with pagination
- Static file serving from `/uploads` directory

### Translation & AI Services

**Azure Translator Integration:**
- Real-time message translation using Azure Cognitive Services Translator API
- Automatic language detection (empty 'from' parameter)
- Translation to target language specified per user preference
- Request tracing with UUID v4 for debugging

**Azure Speech Service:**
- Speech-to-text conversion on frontend using Microsoft Cognitive Services Speech SDK
- Enables voice input for messages

**Design Decision - Translation Approach:**
- **Problem:** Need to support multiple languages per chat room with different user preferences
- **Solution:** Store original message once, translate on-demand per recipient's language
- **Pros:** Reduces storage, maintains message integrity, allows language preference changes
- **Cons:** Additional API calls per message per recipient (mitigated by caching potential)

### Security Considerations

**Authentication Security:**
- JWT tokens with expiration for stateless authentication
- Bcrypt password hashing (12 salt rounds) for manual signups
- Google OAuth2 for trusted identity verification
- Session secrets stored in environment variables

**Data Protection:**
- CORS configured with credentials support
- Express session with secret-based signing
- File upload validation (type and size restrictions)
- COOP and COEP headers for resource isolation

**Authorization:**
- Admin-only operations checked via database queries
- Room membership verification before message access
- User-specific read status tracking

### Performance Optimizations

**Message Loading:**
- Lazy loading with pagination for message history
- Scroll-based infinite loading to reduce initial payload
- Last message caching in ChatRoom table for room list preview

**Database Operations:**
- Connection pooling with mysql2 (10 connection limit)
- Prisma ORM for optimized queries
- Batch updates for read status across multiple users

**File Handling:**
- 10MB file size limit to prevent abuse
- Disk-based storage with UUID filenames to prevent conflicts
- Static file serving through Express for efficient delivery

## External Dependencies

### Third-Party Services

**Azure Cognitive Services:**
- **Azure Translator API:** Real-time text translation with auto-detection
  - Configuration: API key and location/region stored in environment
  - Endpoint: `https://api.cognitive.microsofttranslator.com`
  
- **Azure Speech Service:** Speech-to-text conversion
  - SDK integration on frontend via `microsoft-cognitiveservices-speech-sdk`

**Google OAuth2:**
- Client ID and secret for OAuth authentication
- Callback URL: `http://localhost:3000/auth/google/callback`
- Scopes: profile and email

### Database

**Database System:** 
- Originally configured for MySQL/MariaDB (mysql2 driver)
- Prisma ORM supports multiple databases (PostgreSQL, MySQL, SQLite)
- Current setup uses Azure Cosmos DB for PostgreSQL as mentioned in README
- Connection pooling configured with 10 concurrent connections

**Schema Management:**
- Prisma migrations for schema version control
- Type-safe database client generation
- Environment-based configuration (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)

### NPM Packages

**Frontend Dependencies:**
- `socket.io-client` - WebSocket client for real-time communication
- `axios` - HTTP client for API requests
- `react-router-dom` - Client-side routing
- `react-redux` - Global state management
- `@react-oauth/google` - Google sign-in integration
- `jwt-decode` - JWT token parsing
- `framer-motion` - Animation library
- `react-toastify` - Toast notifications
- `react-hook-form` - Form state management
- `microsoft-cognitiveservices-speech-sdk` - Speech recognition

**Backend Dependencies:**
- `socket.io` - WebSocket server
- `express` - Web framework
- `@prisma/client` - Database ORM client
- `passport` & `passport-google-oauth20` - Authentication
- `jsonwebtoken` - JWT creation and verification
- `bcryptjs` - Password hashing
- `multer` - File upload handling
- `uuid` - Unique identifier generation
- `axios` - HTTP client for Azure API calls
- `cors` - Cross-origin resource sharing
- `express-session` - Session middleware

### Development Tools

- **Vite:** Fast build tool and dev server (port 5000 configured)
- **ESLint:** Code linting with React-specific rules
- **Tailwind CSS:** Utility-first CSS framework with PostCSS
- **Nodemon:** Auto-restart for backend development
- **GitHub Copilot:** AI-assisted development (mentioned in README)

### Environment Configuration

Required environment variables:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth credentials
- `JWT_SECRET`, `JWT_EXPIRES_IN` - Token configuration
- `SESSION_SECRET` - Session signing
- `AZURE_TRANS_KEY`, `AZURE_TRANS_LOCATION` - Translation API
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database connection
- `PORT` - Server port (default 3000)
- `VITE_API_BASE_URL` - Frontend API endpoint (optional)