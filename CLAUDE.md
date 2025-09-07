# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Fact Stream** is an AI-powered news analysis platform built as a monorepo with Bun workspaces. Users submit news article URLs for automated fact-checking and credibility analysis using Google's Gemini AI (or local Ollama in development).

## Commands

### Development
```bash
bun run dev          # Start all services (shared, server, client)
bun run build        # Build all packages
bun run dev:client   # Client development server only
bun run dev:server   # Server development with environment
```

### Client-specific
```bash
cd client
bun run lint         # ESLint
bun run build        # Production build
bun run preview      # Preview production build
```

### Server-specific  
```bash
cd server
bun run build        # TypeScript compilation
```

## Architecture

### Technology Stack
- **Monorepo**: Bun workspaces (client, server, shared packages)
- **Backend**: Hono web framework, PostgreSQL + Drizzle ORM, Puppeteer for scraping
- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS v4, Radix UI, TanStack Query
- **Authentication**: JWT with refresh tokens stored in HTTP-only cookies
- **Real-time**: WebSockets for analysis status updates
- **AI Integration**: Google Gemini API (prod) / Ollama (dev)

### Key URLs
- Server: http://localhost:9000
- Client: http://localhost:3000

### Database Schema
5 main tables: `users`, `refresh_tokens`, `analyze_logs`, `model_response`, `queued_analysis`

## Architecture Patterns

### Analysis Workflow
1. User submits news URL via `/api/v1/analyse` POST
2. Puppeteer extracts article content from URL
3. Content queued for AI analysis (tracked in `queued_analysis` table)  
4. Gemini analyzes for: political alignment, credibility score (0-100), sarcasm/satire detection
5. Results stored in `model_response` table
6. WebSocket broadcasts completion to client
7. Users can publish/unpublish analyses

### Authentication Flow
- JWT access/refresh token pattern
- Cookies stored as HTTP-only for security
- Middleware protection on protected routes
- Automatic token refresh on client

### Type Safety
- End-to-end TypeScript with shared types in `/shared/src/types/`
- Hono RPC for type-safe client-server communication  
- Drizzle ORM for type-safe database operations

### Real-time Updates
- WebSocket endpoint: `/api/v1/ws/:analysisId`
- Server broadcasts analysis status changes
- Client uses `react-use-websocket` for connection management

## Important Files

### Configuration
- `/package.json` - Root workspace configuration
- `/client/vite.config.ts` - Frontend build setup  
- `/server/drizzle.config.ts` - Database migrations
- `/server/src/index.ts` - Main server entry point

### Key Directories
- `/server/src/routes/` - API endpoints (auth, analyse, published, ws)
- `/server/src/lib/db/schema/` - Drizzle database schemas
- `/server/src/lib/` - Utilities (analyseNews.ts, puppeteerUtils.ts)
- `/client/src/pages/` - React pages with React Router v7
- `/client/src/components/ui/` - Radix UI components
- `/shared/src/types/` - Shared TypeScript definitions

## Environment Variables

Required for server:
- `DATABASE_URL` - PostgreSQL connection
- `GEMINI_API_KEY` - Google Gemini API key  
- `CLIENT_URL` - For CORS configuration
- `NODE_ENV` - Environment mode (switches between Gemini/Ollama)

## Development Notes

### AI Integration
- Production uses Gemini 2.5-flash model
- Development uses local Ollama with gemma3:4b model
- Structured prompts return JSON with analysis results
- Handles "Access denied" cases when websites block Puppeteer

### Security Considerations
- Input validation for URLs and content
- CORS properly configured between client/server
- Passwords hashed with bcrypt, minimum 8 characters
- JWT tokens stored in secure HTTP-only cookies

### Database Operations  
- Use Drizzle ORM for all database queries
- Migrations managed through `bun run db:generate` and `bun run db:push`
- Schema changes require updating both schema files and shared types