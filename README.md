
# Products API Server

A RESTful API server built with Express.js for managing products with features like search, filtering, pagination, and statistics.

## Features

- ✅ CRUD operations for products
- ✅ Product search functionality
- ✅ Category filtering and pagination
- ✅ Product statistics
- ✅ API key authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Request logging

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd products-api
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

## Running the Server

### Development
```bash
npm start
```

The server will start on `http://localhost:3000`

### Using different port
```bash
PORT=4000 npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

Protected endpoints require an API key in the request headers:
```
x-api-key: your-secret-key
```

### Endpoints

#### 1. Get All Products
**GET** `/api/products`

Query Parameters:
- `category` (optional): Filter by category
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/products?category=Electronics&page=1&limit=5"
```

**Example Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Mobiles",
      "description": "Latest smartphones",
      "price": 699,
      "category": "Electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalProducts": 6
  }
}
```

#### 2. Get Product by ID
**GET** `/api/products/:id`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/products/1"
```

**Example Response:**
```json
{
  "product": {
    "id": 1,
    "name": "Mobiles",
    "description": "Latest smartphones",
    "price": 699,
    "category": "Electronics",
    "inStock": true
  }
}
```

#### 3. Search Products
**GET** `/api/products/search`

Query Parameters:
- `q` (required): Search term

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/products/search?q=laptop"
```

**Example Response:**
```json
{
  "searchTerm": "laptop",
  "results": [
    {
      "id": 2,
      "name": "Laptops",
      "description": "High performance laptops",
      "price": 1299,
      "category": "Electronics",
      "inStock": true
    }
  ],
  "count": 1
}
```

#### 4. Get Product Statistics
**GET** `/api/products/stats`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/products/stats"
```

**Example Response:**
```json
{
  "totalProducts": 6,
  "categoryStats": {
    "Electronics": 6
  },
  "stockStats": {
    "inStock": 4,
    "outOfStock": 2
  }
}
```

#### 5. Create Product
**POST** `/api/products`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 299.99,
  "category": "Electronics",
  "inStock": true
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-key" \
  -d '{
    "name": "Gaming Mouse",
    "description": "High precision gaming mouse",
    "price": 79.99,
    "category": "Electronics",
    "inStock": true
  }'
```

**Example Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "name": "Gaming Mouse",
    "description": "High precision gaming mouse",
    "price": 79.99,
    "category": "Electronics",
    "inStock": true,
    "id": 1640995200000
  }
}
```

#### 6. Update Product
**PUT** `/api/products/:id`

🔒 **Requires Authentication**

**Request Body:** Same as Create Product

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/products/1" \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-key" \
  -d '{
    "name": "Updated Mobile",
    "description": "Updated smartphone description",
    "price": 799.99,
    "category": "Electronics",
    "inStock": false
  }'
```

**Example Response:**
```json
{
  "message": "Product updated successfully",
  "product": {
    "name": "Updated Mobile",
    "description": "Updated smartphone description",
    "price": 799.99,
    "category": "Electronics",
    "inStock": false,
    "id": 1
  }
}
```

#### 7. Delete Product
**DELETE** `/api/products/:id`

🔒 **Requires Authentication**

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/products/1" \
  -H "x-api-key: my-secret-key"
```

**Example Response:**
```json
{
  "message": "Product with ID 1 deleted successfully"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### Error Response Format
```json
{
  "error": "ErrorType",
  "message": "Detailed error message"
}
```

### Common Error Types

- **ValidationError** (400): Missing or invalid request data
- **AuthError** (401): Invalid or missing API key
- **NotFoundError** (404): Resource not found
- **ServerError** (500): Internal server error

### Example Error Responses

**Missing API Key:**
```json
{
  "error": "AuthError",
  "message": "Invalid API key"
}
```

**Validation Error:**
```json
{
  "error": "ValidationError",
  "message": "All fields are required: name, description, price, category, inStock"
}
```

**Product Not Found:**
```json
{
  "error": "NotFoundError",
  "message": "Product not found"
}
```

## Testing the API

### Using curl
All the examples above use curl commands that you can run directly in your terminal.

### Using Postman
1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:3000`
3. For protected endpoints, add header: `x-api-key: my-secret-key`

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create requests for each endpoint
3. Set appropriate headers and request bodies

## Development Notes

- The server includes request logging middleware
- All async operations are wrapped with error handling
- Input validation is performed on POST/PUT requests
- The current implementation uses in-memory data (products array)
- For production, consider using a proper database




[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19722360&assignment_repo_type=AssignmentRepo)
# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

You will:
1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Endpoints

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 