# Senior Backend Code Review Test

This repository contains a **scenario-based backend code review test** for evaluating a **Senior Backend Developer**.

The project is intentionally written with several design, security, reliability, and maintainability issues.
The candidate should review the code as if it was submitted in a real pull request.

## Tech Stack

- Node.js
- NestJS
- PostgreSQL
- TypeScript


## How to Run Locally

```bash
npm install
npm run start:dev
```

Create a local PostgreSQL database and run:

```bash
psql -d your_database -f database/schema.sql
```

Then create a `.env` file based on `.env.example`.

