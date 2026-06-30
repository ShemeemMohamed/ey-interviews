# Senior Backend Code Review Test

This repository contains a **scenario-based backend code review test** for evaluating a **Senior Backend Developer**.

The project is intentionally written with several design, security, reliability, and maintainability issues.
The candidate should review the code as if it was submitted in a real pull request.

## Tech Stack

- Node.js
- NestJS
- PostgreSQL
- TypeScript

## Interview Objective

Evaluate the candidate's ability to identify issues related to:

- Backend architecture
- Code quality
- SQL injection
- Transaction handling
- PostgreSQL design
- Authentication and authorization
- Error handling
- API consistency
- Reliability
- Scalability
- Production readiness

## Candidate Task

Ask the candidate:

> Please review this backend code as if it was submitted in a production pull request. Identify issues, risks, and improvements. Categorize your comments as Blocker, Major, Minor, or Suggestion. Also explain how you would refactor the code.

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

## Important Note for Interviewer

This code is **intentionally flawed**. Do not use it as production-ready implementation.

The main file to review is:

```text
src/orders/orders.controller.ts
```

## Suggested Interview Duration

| Section | Duration |
|---|---:|
| Candidate reads code | 10 minutes |
| Candidate explains issues | 20 minutes |
| Deep-dive follow-up questions | 20 minutes |
| Refactoring discussion | 15 minutes |
| Scoring and wrap-up | 5 minutes |

Total: **60–70 minutes**

## Expected Senior-Level Areas

A strong senior candidate should identify:

- SQL injection risks
- Controller doing too much
- Missing DTO validation
- Missing authentication and authorization
- Unsafe trust of `user-id` header
- Missing transaction handling
- Race conditions during duplicate order creation
- No unique database constraints
- Weak status transition validation
- External notification call inside request flow
- No retry/timeout for external API call
- No pagination in search API
- `SELECT *` usage
- Poor error handling
- Missing observability/logging
- Missing unit/integration tests

## Repository Structure

```text
senior-backend-code-review-test/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   └── db.ts
│   └── orders/
│       └── orders.controller.ts
├── database/
│   └── schema.sql
├── docs/
│   ├── interviewer-guide.md
│   ├── expected-findings.md
│   └── scoring-rubric.md
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env.example
└── README.md
```
