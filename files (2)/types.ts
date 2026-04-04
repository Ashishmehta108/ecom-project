export type DateRange = "7d" | "30d" | "1y";

export type AdminAnalytics = {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    activeCustomers: number;
    averageOrderValue: number;
    refundsAmount: number;
    refundRate: number;
    paymentSuccessCount: number;
    paymentFailureCount: number;
    totalAdminCustomerOrders: number;
    adminCustomerRevenue: number;
    mrr: number;
    conversionRate: number;
  };
  revenueOverTime: Array<{ date: string; revenue: number }>;
  ordersOverTime: Array<{ date: string; count: number }>;
  revenueByStatus: Array<{ status: string; revenue: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalRevenue: number;
    totalQuantity: number;
  }>;
  recentOrders: Array<{
    id: string;
    userName: string | null;
    userEmail: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topCustomers: Array<{
    userId: string;
    name: string | null;
    email: string;
    totalSpent: number;
    ordersCount: number;
  }>;
  adminCustomerOrdersByStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  recentAdminCustomerOrders: Array<{
    id: string;
    customerName: string | null;
    customerEmail: string | null;
    total: number;
    status: string;
    orderStatus: string | null;
    createdAt: string;
  }>;
};

export type KanbanColumn = {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
};

export type KanbanCard = {
  id: string;
  name: string;
  email: string;
  value: number;
  avatar: string;
  tag: string;
  daysInStage: number;
};
