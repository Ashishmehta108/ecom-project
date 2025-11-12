import {
  pgTable,
  text,
  timestamp,
  boolean,
  json,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


export const cart = pgTable("carts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  total: integer("total").notNull().default(0),
  currency: text("currency").notNull().default("INR"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cartItem = pgTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull(),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    quantity: integer("quantity").notNull().default(1),
    addedAt: timestamp("added_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("idx_cart_id").on(table.cartId)]
);

export const favorites = pgTable("favorites", {
  id: text("favoriteid").primaryKey(),
  favoriteItems: json(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
export const orders = pgTable("orders", {
  id: text("orderid").primaryKey(),
  orderItems: json("order_items").$type<OrderItem[]>(),
  totalAmount: text("total_amount").notNull(),
  shippingAddress: json("shipping_address").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export const product = pgTable("product", {
  id: text("productid").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  images: json("images").notNull(),
});

export const review = pgTable("review", {
  id: text("reviewid").primaryKey(),
  rating: text("rating").notNull(),
  comment: text("comment").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
});

export const address = pgTable("address", {
  id: text("addressid").primaryKey(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const paymentMethod = pgTable("paymentmethod", {
  id: text("paymentmethodid").primaryKey(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  accountNumber: text("account_number").notNull(),
  expiryDate: text("expiry_date").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const category = pgTable("category", {
  id: text("categoryid").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const productCategory = pgTable("productcategory", {
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => category.id, { onDelete: "cascade" }),
});

export const productInventory = pgTable("productinventory", {
  id: text("inventoryid").primaryKey(),
  quantity: text("quantity").notNull(),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
});

export const productImage = pgTable("productimage", {
  id: text("imageid").primaryKey(),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
});

export const discount = pgTable("discount", {
  id: text("discountid").primaryKey(),
  code: text("code").notNull(),
  description: text("description").notNull(),
  percentage: text("percentage").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
});

export const productDiscount = pgTable("productdiscount", {
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  discountId: text("discount_id")
    .notNull()
    .references(() => discount.id, { onDelete: "cascade" }),
});

export const wishlist = pgTable("wishlist", {
  id: text("wishlistid").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const wishlistItem = pgTable("wishlistitem", {
  wishlistId: text("wishlist_id")
    .notNull()
    .references(() => wishlist.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
});

export const reviewImage = pgTable("reviewimage", {
  id: text("reviewimageid").primaryKey(),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  reviewId: text("review_id")
    .notNull()
    .references(() => review.id, { onDelete: "cascade" }),
});

export const shipment = pgTable("shipment", {
  id: text("shipmentid").primaryKey(),
  trackingNumber: text("tracking_number").notNull(),
  carrier: text("carrier").notNull(),
  status: text("status").notNull(),
  estimatedDelivery: timestamp("estimated_delivery").notNull(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const payment = pgTable("payment", {
  id: text("paymentid").primaryKey(),
  amount: text("amount").notNull(),
  method: text("method").notNull(),
  status: text("status").notNull(),
  paidAt: timestamp("paid_at").notNull(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const refund = pgTable("refund", {
  id: text("refundid").primaryKey(),
  amount: text("amount").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull(),
  requestedAt: timestamp("requested_at").notNull(),
  processedAt: timestamp("processed_at"),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const notification = pgTable("notification", {
  id: text("notificationid").primaryKey(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const reviewHelpful = pgTable("reviewhelpful", {
  id: text("reviewhelpfulid").primaryKey(),
  isHelpful: boolean("is_helpful").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  reviewId: text("review_id")
    .notNull()
    .references(() => review.id, { onDelete: "cascade" }),
});

export const orderItem = pgTable("orderitem", {
  id: text("orderitemid").primaryKey(),
  quantity: text("quantity").notNull(),
  price: text("price").notNull(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
});
