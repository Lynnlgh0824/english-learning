# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Identity

**Project Name:** English Learning Platform

This is an **independent project**.

Claude must **NEVER** reference files, code, or context from other projects.

Claude must **ONLY** operate within this directory (`/Users/yuzhoudeshengyin/Documents/my_project/english-learning/`).

---

## Architecture Rules

Claude MUST **NOT**:
- Modify folder structure without permission
- Rename files without permission
- Move files without permission
- Delete files without permission

Claude MUST:
- Preserve existing structure
- Follow established patterns
- Extend code without breaking structure

---

## Memory Scope

Claude memory is **LIMITED** to this project directory.

Do **NOT** assume context from:
- Other folders in `/Users/yuzhoudeshengyin/Documents/my_project/`
- Other repositories
- Other projects

---

## Coding Rules

Before coding, Claude must:
1. Read `README.md`
2. Read architecture
3. Follow existing patterns

---

## Safety Rule

If unsure, Claude must **ASK** instead of modifying.

---

## Git Rule

Claude must **NEVER**:
- Expose secrets
- Commit `.env`
- Commit private keys

---

## Project Overview

English Learning is a language learning platform built with Next.js, providing comprehensive English education tools including TTS (Text-to-Speech) functionality and interactive learning experiences.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Package Manager**: pnpm

## Project Structure

```
english-learning/
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   └── styles/               # Styling files
├── public/                   # Static assets
├── learnings/                # Learning resources and experiments
│   ├── moltbook-auth-integration.js  # Moltbook authentication
│   ├── moltbook-auth-test.js         # Auth testing
│   └── MOLTBOOK_AUTH_GUIDE.md        # Auth documentation
└── docs/                     # Documentation
```

## Key Features

- **TTS System**: Text-to-Speech functionality for language learning
- **Interactive Learning**: Engaging learning experiences
- **Authentication**: Integration with external services (Moltbook)
- **Progress Tracking**: Monitor learning progress

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Environment Variables

Key environment variables (check `.env.example` for full list):

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication (if applicable)
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# External Integrations
# Add any API keys or service configurations
```

## Learning Resources

The `learnings/` directory contains experimental features and integration documentation:

- **Moltbook Auth**: Authentication system integration and testing
- **TTS Troubleshooting**: Technical documentation for TTS issues

## Important Notes

- This project focuses on English education and language learning
- TTS functionality is a core feature
- External authentication integrations may require specific configuration
- Learning resources are actively developed and may change

## Getting Started

1. Install dependencies: `pnpm install`
2. Set up environment variables from `.env.example`
3. Start development: `pnpm dev`
4. Open http://localhost:3000

## Documentation

- See `docs/` for detailed documentation
- Check `learnings/MOLTBOOK_AUTH_GUIDE.md` for authentication details
- Refer to `TTS_TROUBLESHOOTING.md` for TTS-related issues

---

**Last Updated**: 2026-02-25
