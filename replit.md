# Chatlas - Real-Time Multilingual Group Chat Application

## Overview
Chatlas is a full-stack web application that enables real-time group chat with automatic translation. Users can communicate in their preferred language, and messages are automatically translated for other participants using Azure AI Translator.

## Project Structure
- **Frontend**: React + Vite + Tailwind CSS (port 5000)
- **Backend**: Node.js + Express + Socket.IO (port 3000)
- **Database**: MySQL (using MariaDB in Replit)
- **AI Services**: Azure AI Translator & Azure Speech Service

## Key Features
- Real-time messaging with Socket.IO
- Auto-translation of messages to user's preferred language
- Speech-to-text conversion
- Google OAuth authentication with JWT
- Unique invitation links for chat rooms
- Persistent message history with lazy loading

## Recent Changes (Oct 31, 2025)
- Configured Vite to run on port 5000 with `allowedHosts: true` for Replit proxy
- Updated backend CORS to accept all origins for Replit compatibility
- Created centralized API configuration (`src/config/api.js`)
- Updated all frontend API calls to use dynamic base URL
- Added API_BASE_URL import to all files using axios
- Installed MariaDB for MySQL database support
- Created backend config.env with database credentials

## Environment Variables
### Frontend (Replit Secrets)
- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_SPEECH_REGION` - Azure Speech Service region
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key
- `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template ID
- `VITE_TRANS_KEY` - Azure Translation API key
- `VITE_TRANS_REGION` - Azure Translation region

### Backend (config.env file)
- Database configuration for MySQL
- Google OAuth credentials
- JWT secrets
- Azure Translation API configuration

## Architecture
The application uses a client-server architecture:
1. Frontend communicates with backend via REST API (axios)
2. Real-time messaging handled by Socket.IO WebSockets
3. Messages stored in original language, translated on delivery
4. Each user sets their language preference

## Development Notes
- Frontend must use 0.0.0.0:5000 to work with Replit's proxy
- Backend uses localhost:3000 (not exposed directly to users)
- CORS configured to accept all origins for Replit environment
- Database needs to be initialized before running the application

## Next Steps
- Initialize MySQL database
- Set up database schema/migrations
- Start backend and frontend workflows
- Test authentication and chat functionality
