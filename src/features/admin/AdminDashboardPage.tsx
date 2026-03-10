import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService, type AdminStats, type AdminOrder } from '@/services/adminService';

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-gray-700 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.getOrders({ limit: 5 }),
    ]).then(([s, o]) => {
      setStats(s);
      setRecentOrders(o.data);
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-sm">Failed to load dashboard: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Orders" value={stats.totalOrders} color="text-blue-600" />
          <StatCard label="Total Revenue" value={`LKR ${stats.totalRevenue.toLocaleString()}`} color="text-green-600" />
          <StatCard label="Total Users" value={stats.totalUsers} color="text-purple-600" />
          <StatCard label="Total Products" value={stats.totalProducts} color="text-orange-600" />
          <StatCard label="Pending Orders" value={stats.pendingOrders} sub="Awaiting action" color="text-yellow-600" />
          <StatCard label="Processing" value={stats.processingOrders} sub="In progress" color="text-indigo-600" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-100">
                <th className="text-left px-4 py-2">Order</th>
                <th className="text-left px-4 py-2">Customer</th>
                <th className="text-left px-4 py-2">Total</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No orders yet</td></tr>
              )}
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{o.customerName}</td>
                  <td className="px-4 py-3 text-gray-700">LKR {o.total.toLocaleString()}</td>
                  <td className="px-4 py-3">{statusBadge(o.status)}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
