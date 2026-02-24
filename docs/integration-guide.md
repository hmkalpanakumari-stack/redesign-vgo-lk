# Frontend-Backend Integration Guide

## Quick Start

### 1. Database Setup

The backend uses PostgreSQL. Update the connection string in `backend/VgoApi/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=vgo_db;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  }
}
```

### 2. Start the Backend

```bash
cd backend/VgoApi
dotnet run
```

The API will:
- Automatically create the database if it doesn't exist
- Run migrations
- Seed sample data on first run
- Be available at `http://localhost:5000` and `https://localhost:7001`

### 3. Configure Frontend

The frontend is already configured to connect to the backend. The `.env.local` file contains:

```
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Start the Frontend

```bash
npm run dev
```

---

## API Services Created

All API services are located in `src/services/`:

### Authentication Service
**File**: [authService.ts](file:///c:/Users/Miyuranga/Desktop/redesign-vgo-lk/src/services/authService.ts)

```typescript
import { authService } from '@/services';

// Login
const { user, token } = await authService.login({
  email: 'demo@vgo.lk',
  password: 'Demo@123'
});

// Register
const { user, token } = await authService.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+94771234567',
  password: 'password',
  confirmPassword: 'password'
});

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### Product Service
**File**: [productService.ts](file:///c:/Users/Miyuranga/Desktop/redesign-vgo-lk/src/services/productService.ts)

```typescript
import { productService } from '@/services';

// Get products with filters
const response = await productService.getProducts({
  page: 1,
  limit: 20,
  category: 'electronics',
  sort: 'price-low-high',
  inStock: true,
  search: 'iphone'
});

// Get product by ID
const product = await productService.getProductById(id);

// Get product by slug
const product = await productService.getProductBySlug('iphone-15-pro-max-256gb');

// Get featured products
const featured = await productService.getFeaturedProducts(10);
```

### Category Service
**File**: [categoryService.ts](file:///c:/Users/Miyuranga/Desktop/redesign-vgo-lk/src/services/categoryService.ts)

```typescript
import { categoryService } from '@/services';

// Get all categories
const categories = await categoryService.getCategories();

// Get category by slug
const category = await categoryService.getCategoryBySlug('electronics');
```

### Order Service
**File**: [orderService.ts](file:///c:/Users/Miyuranga/Desktop/redesign-vgo-lk/src/services/orderService.ts)

```typescript
import { orderService } from '@/services';

// Get user orders
const orders = await orderService.getOrders(1, 10);

// Get order by ID
const order = await orderService.getOrderById(id);

// Create order
const order = await orderService.createOrder({
  items: [
    { productId: 'guid', variantId: 'guid', quantity: 2 }
  ],
  shippingAddressId: 'guid',
  shippingMethodId: 'guid',
  paymentMethodId: 'guid',
  couponCode: 'WELCOME10'
});

// Get shipping methods
const methods = await orderService.getShippingMethods();

// Get payment methods
const methods = await orderService.getPaymentMethods();
```

### Coupon Service
**File**: [couponService.ts](file:///c:/Users/Miyuranga/Desktop/redesign-vgo-lk/src/services/couponService.ts)

```typescript
import { couponService } from '@/services';

// Validate coupon
const result = await couponService.validateCoupon({
  code: 'WELCOME10',
  cartTotal: 50000
});

if (result.isValid) {
  console.log('Discount:', result.discount);
}

// Get active coupons
const coupons = await couponService.getActiveCoupons();
```

### Review Service
**File**: [reviewService.ts](file:///c:/Users/Miyuranga/Desktop/redesign-vgo-lk/src/services/reviewService.ts)

```typescript
import { reviewService } from '@/services';

// Get product reviews
const { reviews, summary } = await reviewService.getProductReviews(
  productId,
  1,
  10,
  'newest'
);

// Create review
const review = await reviewService.createReview(productId, {
  rating: 5,
  title: 'Great product!',
  comment: 'Highly recommended',
  images: ['url1', 'url2']
});

// Mark review as helpful
await reviewService.markReviewHelpful(reviewId);
```

---

## Replacing Mock Data

### Example: Product List Page

**Before** (using mock data):
```typescript
import { products } from '@/data/products';

function ProductList() {
  const [productList] = useState(products);
  // ...
}
```

**After** (using API):
```typescript
import { productService } from '@/services';
import { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: 1,
          limit: 20
        });
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render products...
}
```

### Example: Authentication

**Before** (mock):
```typescript
import { sampleUser } from '@/data/users';

function Login() {
  const handleLogin = () => {
    // Mock login
    setUser(sampleUser);
  };
}
```

**After** (using API):
```typescript
import { authService } from '@/services';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.login({ email, password });
      // Token is automatically stored
      // Update your auth context/state
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
}
```

---

## Sample Data

The database is automatically seeded with:

- **5 main categories** (Electronics, Fashion, Home & Living, Sports, Books)
- **12 products** (including iPhone 15 Pro Max, MacBook Pro, and sample products)
- **3 shipping methods** (Standard, Express, Same Day)
- **4 payment methods** (Card, COD, Bank Transfer, Digital Wallet)
- **3 coupons** (WELCOME10, SAVE500, ELECTRONICS20)
- **1 demo user**:
  - Email: `demo@vgo.lk`
  - Password: `Demo@123`
- **2 product reviews**

---

## Error Handling

All API services include automatic error handling:

- **401 Unauthorized**: Automatically redirects to login and clears token
- **Network errors**: Throws descriptive error messages
- **API errors**: Returns error messages from the API response

Example error handling:

```typescript
try {
  const products = await productService.getProducts();
} catch (error) {
  if (error.message.includes('401')) {
    // User will be automatically redirected to login
  } else {
    // Handle other errors
    console.error('Failed to fetch products:', error.message);
  }
}
```

---

## Authentication Flow

1. **Login/Register**: Call `authService.login()` or `authService.register()`
2. **Token Storage**: JWT token is automatically stored in localStorage
3. **Authenticated Requests**: Token is automatically included in all API requests
4. **Token Expiration**: On 401 response, token is cleared and user is redirected to login
5. **Logout**: Call `authService.logout()` to clear token

---

## Testing the Integration

### 1. Test Backend API

Visit Swagger UI at `https://localhost:7001/swagger` to test endpoints directly.

### 2. Test Authentication

```typescript
// Login with demo user
const { user, token } = await authService.login({
  email: 'demo@vgo.lk',
  password: 'Demo@123'
});
console.log('Logged in:', user);
```

### 3. Test Product Fetching

```typescript
const products = await productService.getProducts({ limit: 5 });
console.log('Products:', products.data);
```

### 4. Test Order Creation

```typescript
// First, get shipping and payment methods
const shippingMethods = await orderService.getShippingMethods();
const paymentMethods = await orderService.getPaymentMethods();

// Create order
const order = await orderService.createOrder({
  items: [{ productId: 'product-guid', quantity: 1 }],
  shippingAddressId: 'address-guid',
  shippingMethodId: shippingMethods[0].id,
  paymentMethodId: paymentMethods[0].id
});
```

---

## Next Steps

1. **Update Components**: Replace mock data imports with API service calls
2. **Add Loading States**: Implement loading indicators for async operations
3. **Error Handling**: Add user-friendly error messages
4. **Authentication Context**: Update AuthContext to use authService
5. **Protected Routes**: Ensure protected routes check `authService.isAuthenticated()`
6. **Pagination**: Implement pagination UI for product lists and orders
7. **Form Validation**: Add validation for login, register, and checkout forms

---

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify connection string in `appsettings.Development.json`
- Check if port 5000/7001 is available

### Frontend can't connect to backend
- Verify backend is running
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

### Authentication not working
- Clear localStorage and try again
- Check network tab for 401 responses
- Verify JWT token is being sent in headers

### Database not seeding
- Delete the database and restart the backend
- Check console logs for seeding errors
- Verify all required packages are installed
