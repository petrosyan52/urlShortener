# URL Shortener Project

This project is a full-stack URL shortener application built with:

- **Frontend:** React + TypeScript
- **Backend:** NestJS + TypeORM + PostgreSQL
- **Database:** PostgreSQL
- **Deployment:** Docker + Docker Compose

---

## Features

- User registration and login with JWT authentication
- Create short URLs for any original URL
- Edit slug of short URLs (with validation)
- Track click statistics: total clicks
- Rate limiting on redirects
- Dashboard to manage URLs with copy-to-clipboard and logout
- Backend validations with class-validator
---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories.

### Backend `.env`

```env
PORT=3001
BASE_URL=http://localhost:3001

DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAME=url_shortener
```

### Frontend `.env`

```env
REACT_APP_API_BASE_URL=http://localhost:3000
```

---

## Running with Docker Compose

### Build and Start

```bash
docker-compose up --build
```

### Stop

```bash
docker-compose down
```

---

## Project Structure

```
/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
└── README.md
```

---

## Backend Notes

- **NestJS** with `@nestjs/config`
- Uses **TypeORM** to connect to **PostgreSQL**
- **Rate limiting** applied to redirect endpoint
- Uses `class-validator` to validate inputs (e.g., slug)
- **JWT-based authentication**

---

## Frontend Notes

- React + TypeScript
- Uses Axios for API calls
- Dashboard to:
    - Display short/original URLs
    - Show total clicks
    - Edit slug
    - Copy short URL
- Login/logout system using local storage

---

## API Endpoints

| Method | Endpoint         | Description                         | Auth required |
|--------|------------------|-------------------------------------|---------------|
| POST   | `/auth/register` | Register new user                   | No            |
| POST   | `/auth/login`    | Login user, returns JWT             | No            |
| GET    | `/urls`          | Get list of user URLs               | Yes           |
| POST   | `/url`           | Create new short URL                | Yes           |
| PATCH  | `/url/:id`       | Update slug of a short URL          | Yes           |
| GET    | `/:slug`         | Redirect to original URL, track hit | No            |

---

## Docker Compose Overview

```yaml
version: '3.8'

networks:
  app-network:
    driver: bridge

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: url_shortener
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - app-network
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
    ports:
      - "3001:3001"
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  pgdata:
```

---

## Useful Docker Commands

```bash
# Build and run in background
docker-compose up --build -d

# View logs for backend
docker-compose logs -f backend

# Reset volumes (deletes data)
docker-compose down -v

# Open shell in backend container
docker exec -it <backend_container_id> sh
```

---

## License

MIT © Gor Petrosyan
