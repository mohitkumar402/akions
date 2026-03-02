#!/bin/bash

# Akions Docker Quick Start Script
# Usage: ./docker-quickstart.sh [command]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Akions Docker Quick Start ===${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker Desktop or Docker Engine.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose.${NC}"
    exit 1
fi

# Display help
show_help() {
    echo -e "${BLUE}Available commands:${NC}"
    echo "  start       - Start all services"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  logs        - View logs from all services"
    echo "  logs-backend - View backend logs only"
    echo "  logs-frontend - View frontend logs only"
    echo "  logs-db     - View MongoDB logs only"
    echo "  status      - Show service status"
    echo "  shell-backend - Open bash in backend container"
    echo "  shell-frontend - Open bash in frontend container"
    echo "  db-cli      - Connect to MongoDB shell"
    echo "  build       - Build images"
    echo "  clean       - Remove containers and volumes (WARNING: data loss)"
    echo "  help        - Show this help message"
    echo ""
}

# Parse command
COMMAND="${1:-help}"

case "$COMMAND" in
    start)
        echo -e "${YELLOW}📦 Starting services...${NC}"
        cd "$PROJECT_ROOT"
        
        # Check if .env exists
        if [ ! -f .env ]; then
            echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
            cp .env.example .env
            echo -e "${GREEN}✅ .env created. Please edit it with your settings.${NC}"
        fi
        
        docker-compose up -d --pull always
        
        echo -e "${GREEN}✅ Services started!${NC}"
        echo -e "Backend API: ${BLUE}http://localhost:3000${NC}"
        echo -e "Frontend: ${BLUE}http://localhost:19006${NC}"
        echo -e "MongoDB: ${BLUE}localhost:27017${NC}"
        echo ""
        echo -e "Run ${BLUE}'./docker-quickstart.sh logs'${NC} to view logs"
        ;;
        
    stop)
        echo -e "${YELLOW}🛑 Stopping services...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose down
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
        
    restart)
        echo -e "${YELLOW}🔄 Restarting services...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose restart
        echo -e "${GREEN}✅ Services restarted${NC}"
        ;;
        
    logs)
        echo -e "${YELLOW}📋 Showing logs (Ctrl+C to exit)...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose logs -f
        ;;
        
    logs-backend)
        echo -e "${YELLOW}📋 Backend logs (Ctrl+C to exit)...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose logs -f backend
        ;;
        
    logs-frontend)
        echo -e "${YELLOW}📋 Frontend logs (Ctrl+C to exit)...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose logs -f frontend
        ;;
        
    logs-db)
        echo -e "${YELLOW}📋 MongoDB logs (Ctrl+C to exit)...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose logs -f mongodb
        ;;
        
    status)
        echo -e "${YELLOW}📊 Service status:${NC}"
        cd "$PROJECT_ROOT"
        docker-compose ps
        ;;
        
    shell-backend)
        echo -e "${YELLOW}📍 Opening bash in backend container...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose exec backend /bin/sh
        ;;
        
    shell-frontend)
        echo -e "${YELLOW}📍 Opening bash in frontend container...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose exec frontend /bin/sh
        ;;
        
    db-cli)
        echo -e "${YELLOW}📍 Connecting to MongoDB...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose exec mongodb mongosh admin -u admin -p password
        ;;
        
    build)
        echo -e "${YELLOW}🔨 Building images...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose build --no-cache
        echo -e "${GREEN}✅ Build complete${NC}"
        ;;
        
    clean)
        echo -e "${RED}⚠️  WARNING: This will delete all containers and volumes (including database data)${NC}"
        read -p "Are you sure? (yes/no): " CONFIRM
        if [ "$CONFIRM" = "yes" ]; then
            echo -e "${YELLOW}🗑️  Cleaning up...${NC}"
            cd "$PROJECT_ROOT"
            docker-compose down -v
            echo -e "${GREEN}✅ Cleanup complete${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;
        
    help)
        show_help
        ;;
        
    *)
        echo -e "${RED}❌ Unknown command: $COMMAND${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
