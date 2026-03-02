# Docker Containerization Guide - Akions Project

This guide explains the Docker setup for the Akions full-stack project.

## Project Structure

```
akions-app/
├── backend/          # Node.js/Express API
├── frontend/         # React/Expo Web App
├── docker-compose.yml
└── .env.example
```

## Services

### 1. **MongoDB** (mongodb:7-alpine)
- Database service for the backend
- Default credentials: `admin:password` (change in .env)
- Port: 27017 (mapped from container)
- Volume: `mongodb_data` (persistent storage)

### 2. **Backend API** (Node.js/Express)
- Port: 3000
- Built from `backend/Dockerfile` (multi-stage build)
- Depends on MongoDB
- Health check: `/api/health` endpoint

### 3. **Frontend** (React/Expo Web)
- Port: 19006 (Expo web development server)
- Built from `frontend/Dockerfile`
- Depends on Backend for API calls
- Environment: Set `REACT_APP_API_URL` for API endpoint

## Quick Start

### Prerequisites
- Docker Desktop or Docker Engine
- Docker Compose v1.29+

### 1. Setup Environment
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your settings (JWT_SECRET, MongoDB credentials, etc.)
```

### 2. Build and Start Services
```bash
# Pull fresh images and start all services
docker compose up --pull always

# Or in detached mode
docker compose up -d
```

### 3. Access Services
- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:19006
- **MongoDB**: localhost:27017

### 4. View Logs
```bash
# View logs from all services
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f mongodb
docker compose logs -f frontend
```

### 5. Stop Services
```bash
docker compose down

# Remove volumes (WARNING: deletes database data)
docker compose down -v
```

## Environment Configuration

Edit `.env` to customize:

```env
# MongoDB
MONGODB_USER=admin
MONGODB_PASSWORD=password
MONGODB_PORT=27017

# Backend
NODE_ENV=production
BACKEND_PORT=3000
JWT_SECRET=your-secret-key-change-in-production
CORS_ALLOWED_ORIGINS=http://localhost:3001,http://localhost:19006

# Frontend
FRONTEND_PORT=19006
REACT_APP_API_URL=http://localhost:3000

# Optional: Razorpay
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret

# Optional: Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
```

## Development with Docker

### Running Commands in Containers
```bash
# Run backend npm commands
docker compose exec backend npm run seed:blogs

# Run MongoDB commands
docker compose exec mongodb mongosh admin -u admin -p password

# View MongoDB collections
docker compose exec mongodb mongosh admin -u admin -p password --eval "use ekions; db.getCollectionNames()"
```

### Mounting Local Code (Live Reload)
For development with hot reload, add volumes to docker-compose.yml:

```yaml
backend:
  # ... existing config
  volumes:
    - ./backend:/app  # Mount entire backend directory
    - /app/node_modules  # Keep node_modules in container

frontend:
  # ... existing config
  volumes:
    - ./frontend:/app
    - /app/node_modules
```

Then use:
```bash
docker compose up
```

Changes to local code will be reflected in containers (if backend runs with nodemon, frontend with Expo watch mode).

### Building Images Locally
```bash
# Build backend only
docker build -f backend/Dockerfile -t akions-backend:dev backend/

# Build frontend only
docker build -f frontend/Dockerfile -t akions-frontend:dev frontend/

# Use custom images in docker-compose.yml
# Change: image: akions-backend:dev
```

## Production Considerations

### Security
- Change `JWT_SECRET` to a strong value
- Use environment-specific `.env` files
- Don't commit `.env` to version control
- Run containers as non-root users (already configured)
- Use network policies to restrict container communication

### Performance
- Use Alpine-based images (smaller size, faster pull)
- Implement multi-stage builds for backend (already configured)
- Enable gzip compression in nginx (frontend uses built-in)
- Use health checks for graceful restarts

### Scaling
For production scaling:
- Use Docker Swarm or Kubernetes
- Separate database from application containers
- Use managed database services (MongoDB Atlas, etc.)
- Implement load balancing (nginx, HAProxy)
- Use container orchestration for auto-scaling

## Troubleshooting

### MongoDB Connection Fails
```bash
# Check MongoDB logs
docker compose logs mongodb

# Verify connection string in backend logs
docker compose logs backend | grep -i mongodb

# Test connection manually
docker compose exec mongodb mongosh admin -u admin -p password
```

### Backend Can't Reach Frontend or Vice Versa
```bash
# Check network connectivity
docker compose exec backend wget http://frontend:19006 -O /dev/null

# Inspect network
docker network inspect akions-network
```

### Port Already in Use
```bash
# Change ports in .env or docker-compose.yml
BACKEND_PORT=3001
FRONTEND_PORT=19007
MONGODB_PORT=27018
```

### Out of Disk Space
```bash
# Clean up Docker system
docker system prune -a --volumes

# Check usage
docker system df
```

## Best Practices Used

✅ **Multi-stage builds** - Reduces final image size  
✅ **Non-root users** - Improves security  
✅ **Health checks** - Enables graceful restarts  
✅ **Alpine base images** - Smaller and faster  
✅ **Named volumes** - Better data persistence  
✅ **Network isolation** - Services on dedicated network  
✅ **Environment variables** - Configuration without rebuilding  
✅ **Layer caching** - Faster rebuilds during development  

## File Structure Explanation

- **Dockerfile** (backend): Multi-stage build with production optimization
- **Dockerfile** (frontend): Runs Expo web development server
- **.dockerignore**: Excludes unnecessary files from build context
- **docker-compose.yml**: Orchestrates all services
- **.env.example**: Template for environment configuration

## Additional Commands

```bash
# Rebuild images (ignore cache)
docker compose build --no-cache

# View running containers
docker compose ps

# Execute shell in container
docker compose exec backend /bin/sh
docker compose exec mongodb /bin/sh

# View resource usage
docker stats

# Pull latest base images
docker pull node:18-alpine
docker pull mongo:7-alpine

# Push images to registry (replace with your registry)
docker tag akions-backend:latest your-registry/akions-backend:latest
docker push your-registry/akions-backend:latest
```

## Support

For Docker documentation, visit:
- [Docker Compose Reference](https://docs.docker.com/compose/reference/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
