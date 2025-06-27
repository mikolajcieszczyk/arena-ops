# Arena Ops

Monolithic application containing the Arena Ops backend API and frontend.

## Project Structure

```
arena-ops/
├── api/          # Backend API (NestJS)
├── frontend/     # Frontend application
├── .gitignore    # Git ignore rules
├── docker-compose.yml # Docker Compose configuration
└── README.md     # This file
```

## Quick Start with Docker Compose

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. **Clone the repository**

   ```bash
   git clone https://github.com/mikolajcieszczyk/arena-ops.git
   cd arena-ops
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - API: http://localhost:3000
   - Database: localhost:5432

### Development

#### Backend (API)

The backend is written in NestJS with TypeScript.

```bash
# Using Docker Compose (recommended)
docker-compose up api

# Or locally
cd api
yarn install
yarn start:dev
```

#### Frontend

Frontend will be added here in the future.

```bash
cd frontend
# Instructions will be added after creating the frontend
```

### Database

PostgreSQL database is automatically started with Docker Compose.

**Connection details:**

- Host: localhost (or `db` from within containers)
- Port: 5432
- Database: arena_ops
- Username: postgres
- Password: password

### Useful Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api

# Restart specific service
docker-compose restart api

# Remove all data (including database)
docker-compose down -v
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
