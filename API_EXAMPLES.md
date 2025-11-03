# API Examples

This document provides detailed examples of using the NestJS API Starter.

## Items CRUD Operations

### Create an Item

**Request:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Item",
    "description": "This is a sample item"
  }'
```

**Response:**
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

**Request:**
```bash
curl http://localhost:3000/items
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Sample Item",
    "description": "This is a sample item",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get a Specific Item

**Request:**
```bash
curl http://localhost:3000/items/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Sample Item",
  "description": "This is a sample item",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Update an Item

**Request:**
```bash
curl -X PUT http://localhost:3000/items/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item",
    "description": "This item has been updated"
  }'
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Updated Item",
  "description": "This item has been updated",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

### Delete an Item

**Request:**
```bash
curl -X DELETE http://localhost:3000/items/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
- HTTP Status: 204 No Content
- Empty body

### Error Responses

#### Item Not Found (404)

**Response:**
```json
{
  "statusCode": 404,
  "message": "Item with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

#### Validation Error (400)

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "name must be a string"
  ],
  "error": "Bad Request"
}
```

## Debug Endpoints (Development Only)

### Get Debug Endpoints Index

**Request:**
```bash
curl http://localhost:3000/debug/pprof
```

**Response:**
```json
{
  "message": "Debug endpoints (pprof equivalent)",
  "endpoints": [
    "/debug/pprof",
    "/debug/pprof/heap",
    "/debug/pprof/profile",
    "/debug/pprof/metrics"
  ],
  "note": "These endpoints are only available in development mode"
}
```

### Get Heap Statistics

**Request:**
```bash
curl http://localhost:3000/debug/pprof/heap
```

**Response:**
```json
{
  "type": "heap",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "memory": {
    "rss": "377.86 MB",
    "heapTotal": "289.29 MB",
    "heapUsed": "283.15 MB",
    "external": "5.18 MB",
    "arrayBuffers": "2.25 MB"
  },
  "raw": {
    "rss": 396218368,
    "heapTotal": 303345664,
    "heapUsed": 296904920,
    "external": 5434617,
    "arrayBuffers": 2363997
  }
}
```

### Get Runtime Profile

**Request:**
```bash
curl http://localhost:3000/debug/pprof/profile
```

**Response:**
```json
{
  "type": "profile",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "process": {
    "pid": 12345,
    "uptime": "136.39 seconds",
    "version": "v20.19.5",
    "platform": "linux",
    "arch": "x64"
  },
  "cpu": {
    "user": 10270671,
    "system": 446202
  }
}
```

### Get Application Metrics

**Request:**
```bash
curl http://localhost:3000/debug/pprof/metrics
```

**Response:**
```json
{
  "type": "metrics",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "process": {
    "pid": 12345,
    "uptime": 136.388331474,
    "version": "v20.19.5",
    "platform": "linux",
    "arch": "x64"
  },
  "memory": {
    "rss": 396480512,
    "heapTotal": 303345664,
    "heapUsed": 296960448,
    "external": 5434657,
    "arrayBuffers": 2363997
  },
  "cpu": {
    "user": 10270671,
    "system": 446202
  }
}
```

## Using the Example Script

An example shell script is provided to demonstrate all API operations:

```bash
./example.sh
```

This script will:
1. Create multiple items
2. Get all items
3. Get a specific item
4. Update an item
5. Delete an item
6. Test debug endpoints

## Testing with Swagger UI

Visit `http://localhost:3000/swagger` to access the interactive Swagger UI where you can:

- View all available endpoints
- See request/response schemas
- Try out API calls directly from the browser
- View example requests and responses
