import { AdminAnalytics, KanbanColumn } from "../types";

function generateRevenueSeries(days: number): Array<{ date: string; revenue: number }> {
  const result = [];
  const now = new Date();
  let base = 18000;
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    base = Math.max(5000, base + (Math.random() - 0.42) * 3000);
    result.push({
      date: d.toISOString().split("T")[0],
      revenue: Math.round(base),
    });
  }
  return result;
}

function generateOrdersSeries(days: number): Array<{ date: string; count: number }> {
  const result = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 120) + 30,
    });
  }
  return result;
}

export const mockAnalytics: AdminAnalytics = {
  kpis: {
    totalRevenue: 487230,
    totalOrders: 3841,
    activeCustomers: 1247,
    averageOrderValue: 126.8,
    refundsAmount: 9440,
    refundRate: 1.9,
    paymentSuccessCount: 3762,
    paymentFailureCount: 79,
    totalAdminCustomerOrders: 284,
    adminCustomerRevenue: 54280,
    mrr: 42600,
    conversionRate: 3.8,
  },
  revenueOverTime: generateRevenueSeries(30),
  ordersOverTime: generateOrdersSeries(30),
  revenueByStatus: [
    { status: "paid", revenue: 432100 },
    { status: "pending", revenue: 36700 },
    { status: "refunded", revenue: 9440 },
    { status: "failed", revenue: 8990 },
  ],
  topProducts: [
    { productId: "p1", productName: "Pro Plan Annual", totalRevenue: 184200, totalQuantity: 410 },
    { productId: "p2", productName: "Starter Monthly", totalRevenue: 97400, totalQuantity: 812 },
    { productId: "p3", productName: "Enterprise Suite", totalRevenue: 78900, totalQuantity: 46 },
    { productId: "p4", productName: "Add-on Storage", totalRevenue: 34100, totalQuantity: 930 },
    { productId: "p5", productName: "API Access", totalRevenue: 22800, totalQuantity: 228 },
  ],
  recentOrders: [
    { id: "ord_01HXYZ1", userName: "Sophia Carter", userEmail: "sophia@acmecorp.io", total: 299, status: "paid", createdAt: new Date(Date.now() - 12e5).toISOString() },
    { id: "ord_01HXYZ2", userName: "Marcus Webb", userEmail: "m.webb@techflow.com", total: 49, status: "paid", createdAt: new Date(Date.now() - 36e5).toISOString() },
    { id: "ord_01HXYZ3", userName: null, userEmail: "guest_1@mail.com", total: 149, status: "pending", createdAt: new Date(Date.now() - 72e5).toISOString() },
    { id: "ord_01HXYZ4", userName: "Priya Nair", userEmail: "priya.n@startup.dev", total: 599, status: "paid", createdAt: new Date(Date.now() - 144e5).toISOString() },
    { id: "ord_01HXYZ5", userName: "Jordan Lee", userEmail: "jordan@labs.co", total: 99, status: "refunded", createdAt: new Date(Date.now() - 216e5).toISOString() },
    { id: "ord_01HXYZ6", userName: "Emma Schultz", userEmail: "emma@vaultai.com", total: 199, status: "paid", createdAt: new Date(Date.now() - 288e5).toISOString() },
    { id: "ord_01HXYZ7", userName: "Ravi Patel", userEmail: "ravi@finedge.in", total: 49, status: "failed", createdAt: new Date(Date.now() - 360e5).toISOString() },
    { id: "ord_01HXYZ8", userName: "Chloe Martin", userEmail: "chloe@bloom.fr", total: 299, status: "paid", createdAt: new Date(Date.now() - 432e5).toISOString() },
  ],
  topCustomers: [
    { userId: "u1", name: "Acme Corp", email: "billing@acmecorp.io", totalSpent: 14800, ordersCount: 24 },
    { userId: "u2", name: "TechFlow Inc", email: "finance@techflow.com", totalSpent: 9200, ordersCount: 18 },
    { userId: "u3", name: "Priya Nair", email: "priya.n@startup.dev", totalSpent: 5990, ordersCount: 10 },
  ],
  adminCustomerOrdersByStatus: [
    { status: "paid", count: 218, revenue: 41240 },
    { status: "pending", count: 42, revenue: 8400 },
    { status: "refunded", count: 24, revenue: 4640 },
  ],
  recentAdminCustomerOrders: [],
};

export const userGrowthData = [
  { week: "W1", new: 142, churned: 18 },
  { week: "W2", new: 198, churned: 22 },
  { week: "W3", new: 167, churned: 14 },
  { week: "W4", new: 224, churned: 31 },
  { week: "W5", new: 189, churned: 19 },
  { week: "W6", new: 256, churned: 27 },
  { week: "W7", new: 301, churned: 35 },
  { week: "W8", new: 278, churned: 22 },
];

export const kanbanData: KanbanColumn[] = [
  {
    id: "leads",
    title: "Leads",
    color: "#6366f1",
    cards: [
      { id: "k1", name: "Oliver Zhang", email: "oliver@nextstep.io", value: 4800, avatar: "OZ", tag: "Enterprise", daysInStage: 3 },
      { id: "k2", name: "Amara Diallo", email: "amara@loopai.com", value: 1200, avatar: "AD", tag: "Starter", daysInStage: 1 },
      { id: "k3", name: "Ben Foster", email: "ben@gridsys.com", value: 8400, avatar: "BF", tag: "Pro", daysInStage: 5 },
    ],
  },
  {
    id: "trial",
    title: "Trial",
    color: "#f59e0b",
    cards: [
      { id: "k4", name: "Leila Hassan", email: "leila@forma.design", value: 2400, avatar: "LH", tag: "Pro", daysInStage: 7 },
      { id: "k5", name: "Ivan Petrov", email: "ivan@datacraft.ru", value: 9600, avatar: "IP", tag: "Enterprise", daysInStage: 12 },
    ],
  },
  {
    id: "paying",
    title: "Paying",
    color: "#10b981",
    cards: [
      { id: "k6", name: "Sophia Carter", email: "sophia@acmecorp.io", value: 14800, avatar: "SC", tag: "Enterprise", daysInStage: 45 },
      { id: "k7", name: "Marcus Webb", email: "m.webb@techflow.com", value: 5880, avatar: "MW", tag: "Pro", daysInStage: 62 },
      { id: "k8", name: "Priya Nair", email: "priya.n@startup.dev", value: 2880, avatar: "PN", tag: "Starter", daysInStage: 28 },
    ],
  },
  {
    id: "churned",
    title: "Churned",
    color: "#ef4444",
    cards: [
      { id: "k9", name: "Jordan Lee", email: "jordan@labs.co", value: 588, avatar: "JL", tag: "Starter", daysInStage: 90 },
    ],
  },
];
