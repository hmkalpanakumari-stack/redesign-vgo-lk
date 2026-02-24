# API Documentation

## Base URL

```
Production: https://api.vgo.lk/v1
Development: http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Token).

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Authentication Flow

1. **Login** or **Register** to receive a JWT token
2. Include the token in the `Authorization` header for protected endpoints
3. Token expires after 24 hours (configurable)
4. Refresh token using `/auth/refresh` endpoint

---

## API Endpoints

### Authentication

#### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Perera",
  "email": "john@example.com",
  "phone": "+94771234567",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Perera",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login

Authenticate user and receive token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Perera",
      "avatar": "https://...",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/logout

Logout current user (invalidate token).

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me

Get current authenticated user.

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Perera",
    "phone": "+94771234567",
    "avatar": "https://...",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "isVerified": true,
    "createdAt": "2023-06-15T10:00:00Z",
    "updatedAt": "2024-01-10T15:30:00Z"
  }
}
```

---

### Products

#### GET /products

Get paginated list of products with filtering and sorting.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page
- `sort` (string) - Sort option: `relevance`, `price-low-high`, `price-high-low`, `newest`, `rating`, `best-selling`
- `category` (string) - Category slug
- `brand` (string) - Brand name
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `inStock` (boolean) - Only in-stock items
- `onSale` (boolean) - Only items on sale
- `search` (string) - Search query

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "iPhone 15 Pro Max 256GB",
        "slug": "iphone-15-pro-max-256gb",
        "description": "...",
        "shortDescription": "...",
        "price": {
          "amount": 489900,
          "originalAmount": 529900,
          "currency": "Rs.",
          "discountPercentage": 8
        },
        "images": [...],
        "category": {...},
        "brand": "Apple",
        "stock": 45,
        "rating": 4.8,
        "reviewCount": 234,
        "isFeatured": true,
        "isNew": true
      }
    ],
    "pagination": {
      "total": 245,
      "page": 1,
      "limit": 20,
      "totalPages": 13
    },
    "filters": [...]
  }
}
```

#### GET /products/:id

Get product by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 15 Pro Max 256GB",
    "slug": "iphone-15-pro-max-256gb",
    "description": "...",
    "price": {...},
    "images": [...],
    "category": {...},
    "variants": [...],
    "specifications": [...],
    "bulkPrices": [...],
    "stock": 45,
    "rating": 4.8,
    "reviewCount": 234
  }
}
```

#### GET /products/slug/:slug

Get product by slug.

**Response:** Same as GET /products/:id

#### GET /products/featured

Get featured products.

**Query Parameters:**
- `limit` (number, default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [...]
}
```

#### GET /products/search

Search products.

**Query Parameters:**
- `q` (string, required) - Search query
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response:** Same structure as GET /products

---

### Categories

#### GET /categories

Get all categories with hierarchy.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "...",
      "image": "https://...",
      "icon": "📱",
      "productCount": 245,
      "children": [
        {
          "id": "uuid",
          "name": "Smartphones",
          "slug": "smartphones",
          "parentId": "uuid",
          "productCount": 89
        }
      ]
    }
  ]
}
```

#### GET /categories/:id

Get category by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Electronics",
    "slug": "electronics",
    "description": "...",
    "image": "https://...",
    "productCount": 245,
    "children": [...]
  }
}
```

#### GET /categories/slug/:slug

Get category by slug.

**Response:** Same as GET /categories/:id

---

### Orders

#### GET /orders

Get user's orders.

**Headers:** Requires authentication

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string) - Filter by status

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "VGO-2024-001234",
        "items": [...],
        "shippingAddress": {...},
        "shippingMethod": {...},
        "paymentMethod": {...},
        "subtotal": 579800,
        "shippingCost": 0,
        "discount": 28990,
        "total": 550810,
        "status": "delivered",
        "trackingNumber": "DHL123456789LK",
        "createdAt": "2024-01-10T10:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### GET /orders/:id

Get order details.

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "VGO-2024-001234",
    "items": [...],
    "shippingAddress": {...},
    "billingAddress": {...},
    "shippingMethod": {...},
    "paymentMethod": {...},
    "subtotal": 579800,
    "shippingCost": 0,
    "discount": 28990,
    "tax": 0,
    "total": 550810,
    "couponCode": "WELCOME5",
    "status": "delivered",
    "statusHistory": [...],
    "trackingNumber": "DHL123456789LK",
    "estimatedDelivery": "2024-01-15",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-12T14:30:00Z"
  }
}
```

#### POST /orders

Create new order.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid",
      "quantity": 1
    }
  ],
  "shippingAddressId": "uuid",
  "billingAddressId": "uuid",
  "shippingMethodId": "uuid",
  "paymentMethodId": "uuid",
  "couponCode": "WELCOME10",
  "notes": "Please call before delivery"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "VGO-2024-001237",
    ...
  }
}
```

#### PUT /orders/:id/cancel

Cancel an order.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

#### GET /shipping-methods

Get available shipping methods.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Standard Delivery",
      "description": "Delivery within 3-5 business days",
      "price": 350,
      "estimatedDays": "3-5 days",
      "icon": "📦"
    }
  ]
}
```

#### GET /payment-methods

Get available payment methods.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "card",
      "name": "Credit/Debit Card",
      "description": "Pay securely with Visa, Mastercard, or Amex",
      "icon": "💳",
      "isAvailable": true
    }
  ]
}
```

---

### Addresses

#### GET /users/:userId/addresses

Get user addresses.

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "label": "Home",
      "firstName": "John",
      "lastName": "Perera",
      "phone": "+94771234567",
      "addressLine1": "45 Galle Road",
      "addressLine2": "Apartment 3B",
      "city": "Colombo",
      "district": "Colombo",
      "postalCode": "00300",
      "country": "Sri Lanka",
      "isDefault": true,
      "type": "home"
    }
  ]
}
```

#### POST /users/:userId/addresses

Create new address.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "label": "Office",
  "firstName": "John",
  "lastName": "Perera",
  "phone": "+94771234567",
  "addressLine1": "123 Union Place",
  "addressLine2": "Level 5",
  "city": "Colombo",
  "district": "Colombo",
  "postalCode": "00200",
  "country": "Sri Lanka",
  "isDefault": false,
  "type": "office"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {...}
}
```

#### PUT /users/:userId/addresses/:addressId

Update address.

**Headers:** Requires authentication

**Request Body:** Same as POST

**Response:** `200 OK`

#### DELETE /users/:userId/addresses/:addressId

Delete address.

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### Coupons

#### POST /coupons/validate

Validate a coupon code.

**Request Body:**
```json
{
  "code": "WELCOME10",
  "cartTotal": 25000,
  "categorySlug": "electronics"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "coupon": {
      "id": "uuid",
      "code": "WELCOME10",
      "type": "percentage",
      "value": 10,
      "description": "10% off on your first order"
    },
    "discount": 2500
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "This coupon has expired"
}
```

#### GET /coupons/active

Get active coupons.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "WELCOME10",
      "type": "percentage",
      "value": 10,
      "minOrderAmount": 2000,
      "description": "10% off on your first order",
      "validUntil": "2024-12-31T23:59:59Z"
    }
  ]
}
```

---

### Reviews

#### GET /products/:productId/reviews

Get product reviews.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sort` (string) - `newest`, `highest-rating`, `lowest-rating`, `most-helpful`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "productId": "uuid",
        "userId": "uuid",
        "userName": "Nimal Silva",
        "userAvatar": "https://...",
        "rating": 5,
        "title": "Best iPhone ever!",
        "comment": "...",
        "images": ["https://..."],
        "isVerifiedPurchase": true,
        "helpfulCount": 45,
        "createdAt": "2024-01-12T10:00:00Z"
      }
    ],
    "pagination": {...},
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 234,
      "distribution": {
        "5": 180,
        "4": 40,
        "3": 10,
        "2": 3,
        "1": 1
      }
    }
  }
}
```

#### POST /products/:productId/reviews

Create a product review.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Really happy with this purchase...",
  "images": ["https://..."]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {...}
}
```

#### PUT /reviews/:reviewId/helpful

Mark review as helpful.

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "helpfulCount": 46
  }
}
```

---

### Wishlist

#### GET /users/:userId/wishlist

Get user's wishlist.

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": {...},
      "addedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /users/:userId/wishlist

Add product to wishlist.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "productId": "uuid"
}
```

**Response:** `201 Created`

#### DELETE /users/:userId/wishlist/:productId

Remove product from wishlist.

**Headers:** Requires authentication

**Response:** `200 OK`

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict (e.g., duplicate email) |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

### Example Error Response

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users:** 1000 requests per hour
- **Unauthenticated users:** 100 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## Pagination

Paginated endpoints return data in this format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 245,
    "page": 1,
    "limit": 20,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Versioning

The API uses URL versioning. Current version is `v1`.

```
https://api.vgo.lk/v1/products
```

Breaking changes will result in a new version (v2, v3, etc.).
