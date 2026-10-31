# CampusLink 🎓💼

CampusLink is an AI-assisted college placement and recruitment platform connecting students, recruiters, and placement administrators.

## Roles
- **Student**: Profile and resume management, job discovery, eligibility matching, applications tracking.
- **Recruiter**: Job posting with eligibility rules, AI-assisted skill suggestions, candidate ranking with explainable match scores, interview scheduling.
- **Admin**: Student record administration, recruiter approvals, placement drives oversight, audit logging, and reporting analytics.

## Privacy Note
> **Privacy & Security**: Resume text is sanitized to strip emails and phone numbers before sending to any external LLM provider, and no candidate data is used to train external models.

## Architecture
- **Backend**: Node 20+, Express, MongoDB Atlas + Mongoose, Piscina worker pools, Local Embeddings (`all-MiniLM-L6-v2`), Groq LLM API.
- **Frontend**: React 18, Vite, Tailwind CSS, TanStack Query, React Router 6.

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- MongoDB Atlas connection URI or local MongoDB instance

### Installation
```bash
# Install root, server, and client dependencies
npm install
```

### Environment Setup
Create `.env` in `server/` using `server/.env.example`.

### Running Locally
```bash
# Run both server and client concurrently
npm run dev

# Or run separately
npm run dev:server
npm run dev:client
```
