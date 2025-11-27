"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAppointmentsPaginated, updateAppointmentStatus } from "@/lib/actions/appointment.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAppointments() {
  const [data, setData] = useState<any>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const router = useRouter();

  async function load() {
    setLoading(true);
    const res = await getAppointmentsPaginated(page, 10);
    setData(res.data);
    setPages(res.pages);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [page]);

  async function updateStatus(id: string, status: string) {
    await updateAppointmentStatus(id, status);
    load();
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Device</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((a: any) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">
                      {a.customerName}
                      <br />
                      <span className="text-xs opacity-70">{a.customerEmail}</span>
                    </td>
                    <td className="p-2">{a.deviceType}</td>
                    <td className="p-2">{new Date(a.scheduledDate).toLocaleString()}</td>
                    <td className="p-2 capitalize">{a.status}</td>
                    <td className="p-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "confirmed")}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "completed")}>
                        Complete
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(a.id, "cancelled")}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => router.push(`?page=${page - 1}`)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page >= pages}
                onClick={() => router.push(`?page=${page + 1}`)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
