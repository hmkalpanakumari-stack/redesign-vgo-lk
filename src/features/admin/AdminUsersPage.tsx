import { useEffect, useState, useCallback } from 'react';
import { adminService, type AdminUser, type AdminUserDetail, type AdminOrder } from '@/services/adminService';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function UserDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setDetail(null);
    setError('');
    adminService.getUser(userId)
      .then(setDetail)
      .catch(err => setError(err.message || 'Failed to load user details'));
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {error ? (
          <div className="p-8 text-center text-red-500 text-sm">{error}</div>
        ) : !detail ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="p-4 space-y-5">
            {/* Profile */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                {detail.user.firstName[0]}{detail.user.lastName[0]}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-lg">{detail.user.firstName} {detail.user.lastName}</div>
                <div className="text-sm text-gray-500">{detail.user.email}</div>
                {detail.user.phone && <div className="text-sm text-gray-500">{detail.user.phone}</div>}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${detail.user.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {detail.user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className="text-xs text-gray-400">Joined {new Date(detail.user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{detail.totalOrders}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total Orders</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">LKR {detail.totalSpent.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total Spent</div>
              </div>
            </div>

            {/* Orders */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Order History</div>
              {detail.orders.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">No orders yet</div>
              ) : (
                <div className="space-y-2">
                  {detail.orders.map((o: AdminOrder) => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 text-sm">
                      <div>
                        <div className="font-medium text-gray-800">{o.orderNumber}</div>
                        <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()} · {o.itemCount} item{o.itemCount !== 1 ? 's' : ''}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700 font-medium">LKR {o.total.toLocaleString()}</span>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setFetchError('');
    adminService.getUsers({ page, limit: 20, search: search || undefined })
      .then(res => {
        setUsers(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(err => setFetchError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleClear = () => {
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Users <span className="text-gray-400 font-normal text-base">({total})</span>
        </h1>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search name or email..."
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm">Search</button>
        {search && (
          <button type="button" onClick={handleClear} className="text-sm text-gray-500 hover:text-gray-700 underline">Clear</button>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-100">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Orders</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            )}
            {!loading && fetchError && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-red-500 text-sm">{fetchError}</td></tr>
            )}
            {!loading && !fetchError && users.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
            )}
            {!loading && users.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{u.orderCount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedUserId(u.id)} className="text-blue-600 hover:underline text-xs">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100">Prev</button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100">Next</button>
        </div>
      )}

      {selectedUserId && (
        <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}
