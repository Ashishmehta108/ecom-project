import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  unique,
  numeric,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import { db } from ".";

const user = pgTable("user", {
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

const session = pgTable("session", {
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

const account = pgTable("account", {
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

const verification = pgTable("verification", {
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

/*

Cart Item schema
*/

const cart = pgTable(
  "cart",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    currency: text("currency").notNull().default("INR"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("idx_cart_user_id").on(table.userId)]
);
/*
Cart item schema
*/
const cartItem = pgTable(
  "cart_item",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade", onUpdate: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: text("name").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(1),
    addedAt: timestamp("added_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_cart_item_cart_id").on(table.cartId),
    unique("uq_cart_product").on(table.cartId, table.productId),
  ]
);

/*
Product schema
*/

const product = pgTable("product", {
  id: text("id").primaryKey(),

  productName: text("product_name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),

  subCategory: text("sub_category").notNull(),
  description: text("description").notNull(),

  features: jsonb("features").$type<string[]>().notNull(),

  pricing: jsonb("pricing")
    .$type<{
      price: number;
      currency: string;
      discount: number;
      inStock: boolean;
      stockQuantity?: number;
    }>()
    .notNull(),

  specifications: jsonb("specifications").$type<any>().notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

const category = pgTable("category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("categoryurl").notNull().default("default"),
});

const productCategory = pgTable(
  "productcategory",
  {
    productId: text("product_id")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.productId, table.categoryId] })]
);

const productImage = pgTable("product_image", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" }),
  url: text("url").notNull(),
  fileId: text("file_id").notNull(),
  position: numeric("position").default("0"),
});

export const productRelations = relations(product, ({ many }) => ({
  productImages: many(productImage),
  productCategories: many(productCategory),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}));

export const productCategoryRelations = relations(
  productCategory,
  ({ one }) => ({
    product: one(product, {
      fields: [productCategory.productId],
      references: [product.id],
    }),

    category: one(category, {
      fields: [productCategory.categoryId],
      references: [category.id],
    }),
  })
);

export const categoryRelations = relations(category, ({ many }) => ({
  productCategories: many(productCategory),
}));

const review = pgTable("review", {
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

export const userReviewRelation = relations(user, ({ one, many }) => ({
  reviews: many(review),
}));

export const productReviewRelation = relations(product, ({ many }) => ({
  reviews: many(review),
}));

export const reviewUserRelation = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
}));

export const reviewProductRelation = relations(review, ({ one }) => ({
  product: one(product, {
    fields: [review.productId],
    references: [product.id],
  }),
}));

import { varchar } from "drizzle-orm/pg-core";
const payments = pgTable("payments", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  orderId: text("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),

  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("eur"),

  status: varchar("status", { length: 50 })
    .notNull()
    .default("requires_payment_method"),

  createdAt: timestamp("created_at").defaultNow(),
});

const stripePaymentMethod = pgTable("stripe_payment_method", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  stripePaymentMethodId: text("stripe_pm_id").notNull(),
  type: text("type").notNull(),
  brand: text("brand"),
  last4: varchar("last4", { length: 4 }),
  expiryMonth: integer("exp_month"),
  expiryYear: integer("exp_year"),

  createdAt: timestamp("created_at").defaultNow(),
});
const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).default("0").notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).default("INR"),
  shippingAddressId: text("shipping_address_id").references(() => address.id, {
    onDelete: "set null",
  }),
  stripePaymentIntentId: text("stripe_payment_intent_id"), // pi_xxx
  stripeCheckoutSessionId: text("stripe_checkout_session_id"), // cs_xxx

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  orderStatus: text("order_status").default("pending"),
});

const orderItem = pgTable("order_item", {
  id: text("id").primaryKey(),

  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),

  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const refund = pgTable("refund", {
  id: text("id").primaryKey(),

  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  paymentId: text("payment_id").references(() => payments.id, {
    onDelete: "set null",
  }),

  stripeRefundId: text("stripe_refund_id").notNull(), // re_xxx
  paymentIntentId: text("payment_intent_id").notNull(), // pi_xxx

  amount: integer("amount").notNull(), // paise
  reason: text("reason"),

  status: text("status").notNull().default("pending"),
  // pending | succeeded | failed

  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

const shipment = pgTable("shipment", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  status: text("status").default("pending"),
  estimatedDelivery: timestamp("estimated_delivery"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

const address = pgTable("address", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),

  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const favorites = pgTable("favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

const favoriteItem = pgTable("favorite_item", {
  id: text("id").primaryKey(),
  favoritesId: text("favorites_id")
    .notNull()
    .references(() => favorites.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" }),
  imageUrl: text("image_url").notNull(),
});

export const favoritesRelations = relations(favorites, ({ many }) => ({
  items: many(favoriteItem),
}));

export const favoriteItemRelations = relations(favoriteItem, ({ one }) => ({
  favorites: one(favorites, {
    fields: [favoriteItem.favoritesId],
    references: [favorites.id],
  }),
  product: one(product, {
    fields: [favoriteItem.productId],
    references: [product.id],
  }),
}));

const notification = pgTable("notification", {
  id: text("notificationid").primaryKey(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  shippingAddress: one(address, {
    fields: [orders.shippingAddressId],
    references: [address.id],
  }),
  items: many(orderItem),
  payments: many(payments),
  refunds: many(refund),
  shipments: many(shipment),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(orders, {
    fields: [orderItem.orderId],
    references: [orders.id],
  }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(user, {
    fields: [payments.userId],
    references: [user.id],
  }),
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const refundRelations = relations(refund, ({ one }) => ({
  order: one(orders, {
    fields: [refund.orderId],
    references: [orders.id],
  }),
  payment: one(payments, {
    fields: [refund.paymentId],
    references: [payments.id],
  }),
}));

export const shipmentRelations = relations(shipment, ({ one }) => ({
  order: one(orders, {
    fields: [shipment.orderId],
    references: [orders.id],
  }),
}));

export const stripePaymentMethodRelations = relations(
  stripePaymentMethod,
  ({ one }) => ({
    user: one(user, {
      fields: [stripePaymentMethod.userId],
      references: [user.id],
    }),
  })
);

export const schema = {
  user,
  session,
  account,
  verification,
  cart,
  cartItem,
  product,
  category,
  productCategory,
  productImage,
  review,
  payments,
  stripePaymentMethod,
  orders,
  orderItem,
  refund,
  shipment,
  address,
  favorites,
  favoriteItem,
  notification,
};

export {
  user,
  session,
  account,
  verification,
  cart,
  cartItem,
  product,
  category,
  productCategory,
  productImage,
  review,
  payments,
  stripePaymentMethod,
  orders,
  orderItem,
  refund,
  shipment,
  address,
  favorites,
  favoriteItem,
  notification,
};
