

"use client";

import AdminDashboardPage from "@/components/admin/AdminDashboardPage";
import { getHybridAdminAnalytics as getAdminAnalytics } from "@/lib/actions/admin-actions/admin-analytic";
import { getUserSession } from "@/server";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DateRange } from "@/components/admin/dashboard/types";

type AdminAnalytics = Awaited<ReturnType<typeof getAdminAnalytics>>;

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user session and load analytics
  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        const session = await getUserSession();

        if (!session?.session) {
          redirect("/admin/login");
        }

        if (session?.user.role !== "admin" && session?.session) {
          redirect("/");
        }

        if (session?.user.role !== "admin" && session?.session == null) {
          redirect("/login");
        }

        setUser(session);

        // Load initial analytics
        const daysBack = dateRangeToDays("30d");
        const data = await getAdminAnalytics(daysBack);
        setAnalytics(data);
      } catch (err) {
        console.error("Error initializing admin page:", err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, []);

  // Refetch analytics when date range changes
  useEffect(() => {
    const refetchAnalytics = async () => {
      try {
        setLoading(true);
        const daysBack = dateRangeToDays(dateRange);
        const data = await getAdminAnalytics(daysBack);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    refetchAnalytics();
  }, [dateRange]);

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <AdminDashboardPage
      analytics={analytics}
      dateRange={dateRange}
      onDateRangeChange={handleDateRangeChange}
    />
  );
}

function dateRangeToDays(range: DateRange): number {
  switch (range) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "1y":
      return 365;
    default:
      return 30;
  }
}
