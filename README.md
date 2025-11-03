# NestJS API Starter

A production-ready NestJS API starter template with Redis persistence, Swagger documentation, and environment-based configuration. This application demonstrates best practices for building stateful REST APIs with complete CRUD operations.

## Features

- ✅ **Full CRUD Operations**: Complete Create/Read/Update/Delete example with Items resource
- 🔄 **Redis Persistence**: Atomic operations using Redis pipelines for data consistency
- 🆔 **UUID-based IDs**: Automatic UUID generation for all resources
- ⏰ **Timestamps**: Automatic creation and update timestamps
- 📚 **Swagger/OpenAPI**: Auto-generated interactive API documentation at `/swagger`
- 🔧 **Environment Configuration**: Separate development and production settings
- 🐛 **Debug Endpoints**: Development-only profiling endpoints at `/debug/pprof/*`
- 🔒 **Input Validation**: Built-in request validation using class-validator
- 📦 **TypeScript**: Full TypeScript support with strict typing

## Environment Modes

### Development Mode (`ENVIRONMENT=development`)
- Debug logging enabled
- Verbose error messages
- Debug/profiling endpoints available at `/debug/pprof/*`
- Detailed request logging

### Production Mode (`ENVIRONMENT=production`)
- Optimized settings
- Debug endpoints disabled
- Minimal logging
- Production-ready error handling

## Prerequisites

- Node.js 18+ 
- Redis 6+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and adjust settings:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
ENVIRONMENT=development
PORT=3000
NODE_ENV=development

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

LOG_LEVEL=debug
ENABLE_DEBUG_ENDPOINTS=true
```

### 3. Start Redis

Using Docker Compose (recommended):

```bash
docker-compose up -d
```

Or install Redis locally and start it:

```bash
redis-server
```

### 4. Run the Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, access the interactive Swagger UI at:

```
http://localhost:3000/swagger
```

## API Endpoints

### Items CRUD

- **POST /items** - Create a new item
- **GET /items** - Get all items
- **GET /items/:id** - Get a specific item by UUID
- **PUT /items/:id** - Update an item
- **DELETE /items/:id** - Delete an item

### Debug Endpoints (Development Only)

- **GET /debug/pprof** - Debug endpoints index
- **GET /debug/pprof/heap** - Memory heap statistics
- **GET /debug/pprof/profile** - Runtime profile information
- **GET /debug/pprof/metrics** - Application metrics

## Example Usage

### Create an Item

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Item",
    "description": "This is a sample item"
  }'
```

Response:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Sample Item",
  "description": "This is a sample item",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Get All Items

```bash
curl http://localhost:3000/items
```

### Get a Specific Item

```bash
curl http://localhost:3000/items/123e4567-e89b-12d3-a456-426614174000
```

### Update an Item

```bash
curl -X PUT http://localhost:3000/items/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item",
    "description": "This is an updated description"
  }'
```

### Delete an Item

```bash
curl -X DELETE http://localhost:3000/items/123e4567-e89b-12d3-a456-426614174000
```

## Project Structure

```
src/
├── config/
│   └── configuration.ts       # Environment configuration
├── modules/
│   ├── items/                 # Items CRUD module
│   │   ├── items.controller.ts
│   │   ├── items.service.ts
│   │   └── items.module.ts
│   ├── redis/                 # Redis service module
│   │   ├── redis.service.ts
│   │   └── redis.module.ts
│   └── debug/                 # Debug endpoints module
│       ├── debug.controller.ts
│       └── debug.module.ts
├── common/
│   ├── dto/                   # Data Transfer Objects
│   │   ├── create-item.dto.ts
│   │   ├── update-item.dto.ts
│   │   └── item-response.dto.ts
│   └── interfaces/            # TypeScript interfaces
│       └── item.interface.ts
├── app.module.ts              # Root application module
└── main.ts                    # Application entry point
```

## Redis Data Structure

Items are stored in Redis using the following structure:

- **Set**: `items` - Contains all item IDs
- **Hash**: `items:{id}` - Contains item data with fields:
  - `id`: UUID
  - `name`: Item name
  - `description`: Item description
  - `createdAt`: ISO 8601 timestamp
  - `updatedAt`: ISO 8601 timestamp

### Atomic Operations

All write operations use Redis pipelines to ensure atomicity:

```typescript
// Example: Creating an item with atomic operations
const operations = [
  () => redis.hSet(itemKey, 'id', item.id),
  () => redis.hSet(itemKey, 'name', item.name),
  () => redis.hSet(itemKey, 'description', item.description),
  () => redis.hSet(itemKey, 'createdAt', item.createdAt.toISOString()),
  () => redis.hSet(itemKey, 'updatedAt', item.updatedAt.toISOString()),
  () => redis.sAdd('items', id),
];
await redisService.executePipeline(operations);
```

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Build

```bash
npm run build
```

## Technology Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Typed JavaScript
- **Redis** - In-memory data store
- **Swagger/OpenAPI** - API documentation
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation
- **uuid** - UUID generation

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
