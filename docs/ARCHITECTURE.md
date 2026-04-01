# System Architecture

## Technology Stack
- **Front-end**: React.js
- **Back-end**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)

## Folder Structure
```
my-org-SAQR-ERP/
├── docs/
│   └── ARCHITECTURE.md
├── src/
│   ├── components/
│   ├── models/
│   ├── routes/
│   └── controllers/
└── config/
```

## Data Flow
1. User interacts with the front-end interface.
2. Front-end makes API calls to the back-end.
3. Back-end processes requests and interacts with the database.
4. Data is sent back to the front-end for display.

## Authentication
- Users must login to access the system.
- JWT is used to manage sessions.

## Security Features
- Passwords are hashed with bcrypt before being stored in the database.
- Implementations of CORS to control access to resources.
- Validation of user inputs to prevent injection attacks.