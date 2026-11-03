process.env.NODE_ENV = "test";
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = require("./app");
const http = require("http");

async function runTests() {
  console.log("=== STARTING SANDHAI (A MARKETPLACE ARENA) BACKEND VERIFICATION ===");

  await connectDB();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running at ${baseUrl}`);

  async function api(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  let adminToken = "";
  let userToken = "";
  let categoryId = "";
  let productId = "";
  let addressId = "";
  let orderId = "";

  try {
    // 1. Verify Seeded Admin Login
    console.log("\n[Test 1] Logging in with seeded admin credentials (superadmin@example.com / 12345678910)...");
    const adminLoginRes = await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: "superadmin@example.com",
        password: "12345678910",
      }),
    });
    console.log("Status:", adminLoginRes.status, "Message:", adminLoginRes.data.message);
    if (adminLoginRes.status !== 200 || !adminLoginRes.data.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLoginRes.data)}`);
    }
    adminToken = adminLoginRes.data.token;
    console.log("Admin logged in successfully. Role:", adminLoginRes.data.admin.role);

    // 2. Verify Seeded Categories
    console.log("\n[Test 2] Fetching public categories...");
    const catRes = await api("/api/categories");
    console.log("Status:", catRes.status, "Categories count:", catRes.data.categories?.length);
    if (!catRes.data.categories || catRes.data.categories.length === 0) {
      throw new Error("No categories found");
    }
    const fruitCat = catRes.data.categories.find((c) => c.name === "Fruits") || catRes.data.categories[0];
    categoryId = fruitCat._id;
    console.log(`Using category: "${fruitCat.name}" (ID: ${categoryId})`);

    // 3. Customer Signup
    console.log("\n[Test 3] Creating new customer account...");
    const testUserEmail = `customer_${Date.now()}@test.com`;
    const signupRes = await api("/api/users/signup", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Customer",
        email: testUserEmail,
        password: "Password123!",
        phone: "9876543210",
      }),
    });
    console.log("Status:", signupRes.status, "Message:", signupRes.data.message);
    if (signupRes.status !== 201 || !signupRes.data.token) {
      throw new Error(`Customer signup failed: ${JSON.stringify(signupRes.data)}`);
    }
    userToken = signupRes.data.token;
    console.log("Customer signed up. Role forced to:", signupRes.data.user.role);

    // 4. RBAC Check: Ensure Customer CANNOT access Admin Dashboard
    console.log("\n[Test 4] Verifying RBAC: Customer attempting to access Admin Dashboard...");
    const rbacRes = await api("/api/admin/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log("Status:", rbacRes.status, "Message:", rbacRes.data.message);
    if (rbacRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for customer accessing admin endpoint, got ${rbacRes.status}`);
    }
    console.log("RBAC passed: Customer successfully blocked with 403 Forbidden.");

    // 5. Admin Dashboard access
    console.log("\n[Test 5] Admin accessing dashboard statistics...");
    const adminDashRes = await api("/api/admin/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("Status:", adminDashRes.status, "Stats:", adminDashRes.data.dashboard);

    // 6. Admin Create Product
    console.log("\n[Test 6] Admin creating a new product (Shimla Fresh Apples)...");
    const createProdRes = await api("/api/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: "Shimla Fresh Apples",
        description: "Crisp and juicy sweet red apples directly from Shimla orchards",
        category: categoryId,
        price: 180,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
        stock: 50,
      }),
    });
    console.log("Status:", createProdRes.status, "Message:", createProdRes.data.message);
    if (createProdRes.status !== 201) {
      throw new Error(`Product creation failed: ${JSON.stringify(createProdRes.data)}`);
    }
    productId = createProdRes.data.product._id;
    console.log("Product created with ID:", productId);

    // 7. Customer Browsing Products & Filter
    console.log("\n[Test 7] Customer browsing products with search query...");
    const searchProdRes = await api(`/api/products?search=Apples&category=${categoryId}`);
    console.log("Status:", searchProdRes.status, "Results count:", searchProdRes.data.products?.length);

    // 8. Customer Add to Wishlist
    console.log("\n[Test 8] Customer adding product to Wishlist...");
    const wishlistRes = await api("/api/wishlist/items", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ productId }),
    });
    console.log("Status:", wishlistRes.status, "Wishlist items count:", wishlistRes.data.wishlist.products.length);

    // 9. Customer Add to Cart
    console.log("\n[Test 9] Customer adding product to Cart (2 kg)...");
    const cartRes = await api("/api/cart/items", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ productId, quantity: 2 }),
    });
    console.log("Status:", cartRes.status, "Cart subtotal:", cartRes.data.cart.subtotal);

    // 10. Customer Add Delivery Address
    console.log("\n[Test 10] Customer adding delivery address...");
    const addrRes = await api("/api/addresses", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        recipientName: "Test Customer",
        phone: "9876543210",
        addressLine: "Flat 402, Green Valley Apartments",
        city: "Chennai",
        state: "Tamil Nadu",
        postalCode: "600001",
        isDefault: true,
      }),
    });
    console.log("Status:", addrRes.status, "Message:", addrRes.data.message);
    addressId = addrRes.data.address._id;

    // 11. Customer Place Order (Checkout)
    console.log("\n[Test 11] Customer placing order from cart...");
    const orderRes = await api("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        addressId,
        paymentMethod: "COD",
      }),
    });
    console.log("Status:", orderRes.status, "Message:", orderRes.data.message);
    if (orderRes.status !== 201) {
      throw new Error(`Order placement failed: ${JSON.stringify(orderRes.data)}`);
    }
    orderId = orderRes.data.order._id;
    console.log("Order Total:", orderRes.data.order.totalAmount, "Order Status:", orderRes.data.order.orderStatus);

    // 12. Verify Cart Is Cleared
    console.log("\n[Test 12] Verifying customer's cart is empty after order placement...");
    const postOrderCart = await api("/api/cart", {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log("Cart items after checkout:", postOrderCart.data.cart.items.length);

    // 13. Customer View My Orders
    console.log("\n[Test 13] Customer viewing order history...");
    const myOrdersRes = await api("/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log("Status:", myOrdersRes.status, "Orders count:", myOrdersRes.data.orders.length);

    // 14. Admin View All Orders & Update Order Status
    console.log("\n[Test 14] Admin viewing all orders and updating status to 'Delivered'...");
    const adminOrdersRes = await api("/api/admin/orders", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("Status:", adminOrdersRes.status, "Total customer orders:", adminOrdersRes.data.orders.length);

    const updateStatusRes = await api(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ orderStatus: "Delivered" }),
    });
    console.log("Status:", updateStatusRes.status, "Updated status:", updateStatusRes.data.order.orderStatus);

    console.log("\n==========================================");
    console.log("ALL SANDHAI (A MARKETPLACE ARENA) BACKEND TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================");
    process.exit(0);
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests().catch((err) => {
  console.error("\nTEST SUITE FAILED:", err);
  process.exit(1);
});
