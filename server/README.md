# Sandhai — A Marketplace Arena (Backend API)

A robust Node.js, Express, and MongoDB backend supporting both the **User (Customer) Panel** and **Admin Panel** for the **Sandhai — A Marketplace Arena** e-commerce platform.

Built strictly according to the **FreshMart Frontend & Backend Module Plan** with clean MVC-Service architecture, Role-Based Access Control (RBAC), JWT authentication, automated seeding, server-side price validation, stock reduction, and order processing.

---

## 🚀 Quick Start

### 1. Environment Variables (`.env`)
```env
PORT=3003
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/freshmart
JWT_SECRET=your_jwt_secret_key_here
```

### 2. Install Dependencies & Start Server
```bash
npm install
npm start
```

### 3. Run Verification Tests
```bash
npm test
```

---

## 🔑 Default Seeded Admin & Data

Upon database connection, the backend automatically seeds:
- **Admin Email**: `superadmin@example.com`
- **Admin Password**: `12345678910`
- **Admin Role**: `admin`
- **4 Core Grocery Categories**:
  1. **Fruits** (Fresh, juicy, and seasonal farm fruits)
  2. **Vegetables** (Organic, leafy greens and healthy farm vegetables)
  3. **Dairy Products** (Milk, cheese, butter, yogurt & paneer)
  4. **Grocery & Staples** (Rice, wheat flour, pulses, spices & cooking essentials)

---

## 🏛 Backend Architecture & Structure

```
doodleBlue-backend/
├── config/
│   ├── db.js                   # MongoDB connection & seed runner
│   └── seed.js                 # Automatic seeder for Super Admin & 4 Categories
├── models/
│   ├── user.model.js           # User schema (roles: 'user' | 'admin')
│   ├── category.model.js       # Category schema (name, description, image, isActive)
│   ├── product.model.js        # Product schema (category ref, price, stock, unit, image)
│   ├── cart.model.js           # Cart schema (user ref, product items, quantity)
│   ├── wishlist.model.js       # Wishlist schema (user ref, product refs)
│   ├── address.model.js        # Customer addresses (recipientName, phone, addressLine, etc.)
│   └── order.model.js          # Order schema (item & address snapshots, totals, status)
├── jwt/
│   └── token.service.js        # JWT token generation & verification
├── middleware/
│   ├── auth.middleware.js      # Bearer token verification & active user verification
│   └── role.middleware.js      # RBAC authorization (authorizeRoles, adminOnly)
├── controllers/
│   ├── user.controller.js      # Customer authentication and profile handlers
│   ├── admin.controller.js     # Admin login, dashboard stats, user & order management
│   ├── category.controller.js  # Category CRUD handlers
│   ├── product.controller.js   # Product browsing & admin management handlers
│   ├── cart.controller.js      # Customer cart management handlers
│   ├── wishlist.controller.js  # Customer wishlist handlers
│   ├── address.controller.js   # Customer delivery address handlers
│   └── order.controller.js     # Order placement, cancellation, tracking handlers
├── services/
│   ├── user.service.js         # User registration, authentication, profile logic
│   ├── admin.service.js        # Dashboard aggregation, user status toggle, order status
│   ├── category.service.js     # Category database queries & deletion safety checks
│   ├── productService.js      # Product search, filter, pagination, stock operations
│   ├── cart.service.js         # Cart quantity validations, subtotal calculations
│   ├── wishlist.service.js     # Wishlist add/remove deduplication
│   ├── address.service.js      # Address CRUD & default address toggling
│   └── orderService.js        # Server-side pricing, stock reduction & checkout
├── routes/
│   ├── user.routes.js          # /api/users
│   ├── admin.routes.js         # /api/admin
│   ├── category.routes.js      # /api/categories
│   ├── product.routes.js       # /api/products
│   ├── cart.routes.js          # /api/cart
│   ├── wishlist.routes.js      # /api/wishlist
│   ├── address.routes.js       # /api/addresses
│   └── order.routes.js         # /api/orders
├── app.js                      # Express application & route mounting
└── test-freshmart.js           # End-to-end integration test runner
```

---

## 🔒 Security & Role-Based Access Control (RBAC)

### 1. User Roles
- **`user`**: Standard customer. Can browse products/categories, manage their own cart, wishlist, delivery addresses, and place orders.
- **`admin`**: Administrator. Accesses administrative dashboard, manages categories, products, customer account statuses, and order fulfillment.

### 2. Protected Role Rules
- Public signup (`POST /api/users/signup`) **strictly assigns role `'user'`**. Requests attempting to pass `'admin'` are ignored.
- Admin endpoints (`/api/admin/*`, category/product creation, editing, deletion) are guarded by `authMiddleware` and `adminOnly` middleware.
- Regular customers attempting to reach admin-only routes receive `403 Forbidden`.
- Users can **only** inspect and mutate their own cart, wishlist, addresses, and orders.

### 3. Server-Side Business Rules
- **Server-side Price Calculation**: Order totals are computed strictly from real-time database prices—never trusting amounts sent from client payloads.
- **Stock Management**: Upon order placement, product stock is safely decremented. If an order is cancelled before shipping, stock is restored automatically.
- **Delivery Charge**: Orders with an item total < ₹500 incur a ₹40 delivery charge; orders ₹500 or above receive **Free Delivery** (`₹0`).

---

## 📡 REST API Reference

### Customer User APIs (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/signup` | Public | Register customer account (`name`, `email`, `password`, `phone`) |
| `POST` | `/api/users/login` | Public | Customer login (`email`, `password`) -> Returns JWT |
| `GET` | `/api/users/profile` | Authenticated | View logged-in customer profile |
| `PUT` | `/api/users/profile` | Authenticated | Update profile details (`name`, `phone`) |

### Admin APIs (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Public | Admin login (`email`, `password`) -> Returns JWT |
| `GET` | `/api/admin/dashboard` | Admin Only | Get counts (products, users, orders), total sales & recent orders |
| `GET` | `/api/admin/users` | Admin Only | List all registered customers |
| `PATCH`| `/api/admin/users/:id/status` | Admin Only | Activate or deactivate customer account (`isActive: boolean`) |
| `GET` | `/api/admin/orders` | Admin Only | List all customer orders |
| `PATCH`| `/api/admin/orders/:id/status` | Admin Only | Update order status (`Pending`, `Processing`, `Shipped`, etc.) |

### Category APIs (`/api/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | List active grocery categories |
| `GET` | `/api/categories/:id` | Public | Get single category details |
| `POST` | `/api/categories` | Admin Only | Create new category (`name`, `description`, `image`) |
| `PUT` | `/api/categories/:id` | Admin Only | Update category details |
| `DELETE`| `/api/categories/:id` | Admin Only | Delete category (safeguarded against active products) |

### Product APIs (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products (supports `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`) |
| `GET` | `/api/products/:id` | Public | Get product details |
| `GET` | `/api/products/category/:categoryId` | Public | List products belonging to a category |
| `POST` | `/api/products` | Admin Only | Create product (`name`, `description`, `category`, `price`, `unit`, `image`, `stock`) |
| `PUT` | `/api/products/:id` | Admin Only | Update product details |
| `DELETE`| `/api/products/:id` | Admin Only | Deactivate/delete product |

### Cart APIs (`/api/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Authenticated | Get current customer's cart with calculated subtotal |
| `POST` | `/api/cart/items` | Authenticated | Add item to cart (`productId`, `quantity`) |
| `PATCH`| `/api/cart/items/:productId` | Authenticated | Update item quantity in cart |
| `DELETE`| `/api/cart/items/:productId` | Authenticated | Remove specific item from cart |
| `DELETE`| `/api/cart` | Authenticated | Clear entire cart |

### Wishlist APIs (`/api/wishlist`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wishlist` | Authenticated | Get customer's saved wishlist products |
| `POST` | `/api/wishlist/items` | Authenticated | Add product to wishlist (`productId`) |
| `DELETE`| `/api/wishlist/items/:productId` | Authenticated | Remove product from wishlist |

### Address APIs (`/api/addresses`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/addresses` | Authenticated | List customer's delivery addresses |
| `POST` | `/api/addresses` | Authenticated | Add new address (`recipientName`, `phone`, `addressLine`, `city`, `state`, `postalCode`, `isDefault`) |
| `PUT` | `/api/addresses/:id` | Authenticated | Update customer's address |
| `DELETE`| `/api/addresses/:id` | Authenticated | Delete customer's address |

### Order APIs (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Authenticated | Checkout & place order from cart (`addressId`, `paymentMethod`) |
| `GET` | `/api/orders/my-orders` | Authenticated | Get logged-in customer's order history |
| `GET` | `/api/orders/:id` | Authenticated | View order details (owner or admin) |
| `PATCH`| `/api/orders/:id/cancel` | Authenticated | Cancel eligible order & restore stock |
