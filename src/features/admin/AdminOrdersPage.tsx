import { useEffect, useState, useCallback } from 'react';
import { adminService, type AdminOrder, type OrderDetail } from '@/services/adminService';

const STATUS_OPTIONS = ['', 'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700',
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

function OrderDetailModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    setModalError('');
    adminService.getOrder(orderId)
      .then(o => { setOrder(o); setNewStatus(o.status); })
      .catch(err => setModalError(err.message || 'Failed to load order'));
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) return;
    setUpdating(true);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : prev);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Order Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {modalError ? (
          <div className="p-8 text-center text-red-500 text-sm">{modalError}</div>
        ) : !order ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{order.orderNumber}</div>
                <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Update status */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.filter(Boolean).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order.status}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
              >
                {updating ? 'Saving...' : 'Update Status'}
              </button>
            </div>

            {/* Items */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Items ({order.items.length})</div>
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                    <span className="text-gray-700">{item.productName} × {item.quantity}</span>
                    <span className="text-gray-600">LKR {item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>LKR {order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>LKR {order.shippingCost.toLocaleString()}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-LKR {order.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-200"><span>Total</span><span>LKR {order.total.toLocaleString()}</span></div>
            </div>

            {/* Shipping */}
            <div className="text-sm">
              <div className="font-semibold text-gray-700 mb-1">Shipping Address</div>
              <div className="text-gray-600">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}<br />
                {order.shippingAddress.phone}
              </div>
            </div>

            {/* Status History */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Status History</div>
              <div className="space-y-1">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-500">
                    <StatusBadge status={h.status} />
                    <span>{new Date(h.createdAt).toLocaleString()}</span>
                    {h.note && <span className="text-gray-400">— {h.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setFetchError('');
    adminService.getOrders({ page, limit: 20, status: status || undefined, search: search || undefined })
      .then(res => {
        setOrders(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(err => setFetchError(err.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [page, status, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleClear = () => {
    setSearch('');
    setSearchInput('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Orders <span className="text-gray-400 font-normal text-base">({total})</span></h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search order / customer..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm">Search</button>
        </form>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
        {(search || status) && (
          <button onClick={handleClear} className="text-sm text-gray-500 hover:text-gray-700 underline">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-100">
              <th className="text-left px-4 py-3">Order</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            )}
            {!loading && fetchError && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-red-500 text-sm">{fetchError}</td></tr>
            )}
            {!loading && !fetchError && orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No orders found</td></tr>
            )}
            {!loading && orders.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-800">{o.customerName}</div>
                  <div className="text-xs text-gray-400">{o.customerEmail}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{o.itemCount}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">LKR {o.total.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedOrderId(o.id)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => { setSelectedOrderId(null); fetchOrders(); }}
        />
      )}
    </div>
  );
}
