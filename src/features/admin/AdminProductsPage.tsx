import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService, type AdminProductListItem } from '@/services/adminService';

interface EditState {
  id: string;
  name: string;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');
    adminService.getProducts({ page, limit: 20, search: search || undefined })
      .then(res => {
        setProducts(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(err => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

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

  const openEdit = (p: AdminProductListItem) => {
    setEditing({
      id: p.id,
      name: p.name,
      stock: p.stock,
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      isOnSale: p.isOnSale,
      isBestSeller: p.isBestSeller,
    });
    setSaveError('');
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveError('');
    try {
      await adminService.updateProductStatus(editing.id, {
        stock: editing.stock,
        isFeatured: editing.isFeatured,
        isNew: editing.isNew,
        isOnSale: editing.isOnSale,
        isBestSeller: editing.isBestSeller,
      });
      // Update local state immediately
      setProducts(prev => prev.map(p =>
        p.id === editing.id
          ? { ...p, stock: editing.stock, isFeatured: editing.isFeatured, isNew: editing.isNew, isOnSale: editing.isOnSale, isBestSeller: editing.isBestSeller }
          : p
      ));
      setEditing(null);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggle = (field: keyof Pick<EditState, 'isFeatured' | 'isNew' | 'isOnSale' | 'isBestSeller'>) => {
    setEditing(prev => prev ? { ...prev, [field]: !prev[field] } : null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Products <span className="text-gray-400 font-normal text-base">({total})</span>
        </h1>
        <Link
          to="/admin/products/add"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search name or SKU..."
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
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Tags</th>
              <th className="text-left px-4 py-3">Added</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-red-500 text-sm">{error}</td></tr>
            )}
            {!loading && !error && products.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No products found</td></tr>
            )}
            {!loading && products.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{p.name}</div>
                  {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.categoryName}</td>
                <td className="px-4 py-3 text-gray-700">LKR {p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 10 ? 'text-yellow-600' : 'text-gray-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isFeatured && <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">Featured</span>}
                    {p.isNew && <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">New</span>}
                    {p.isOnSale && <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full">Sale</span>}
                    {p.isBestSeller && <span className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded-full">Best Seller</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 hover:border-blue-400 px-2 py-1 rounded-lg transition-colors"
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end">
          <button onClick={() => setPage(pg => Math.max(1, pg - 1))} disabled={page === 1}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100">Prev</button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <button onClick={() => setPage(pg => Math.min(totalPages, pg + 1))} disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100">Next</button>
        </div>
      )}

      {/* Edit Status Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-gray-800 text-base">Edit Product Status</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{editing.name}</p>
              </div>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            {/* Stock */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock Quantity</label>
              <input
                type="number"
                min={0}
                value={editing.stock}
                onChange={e => setEditing(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tag toggles */}
            <div className="space-y-3 mb-5">
              <p className="text-xs font-medium text-gray-600">Product Tags</p>
              {([
                ['isFeatured', 'Featured', 'bg-blue-600'],
                ['isNew', 'New Arrival', 'bg-green-600'],
                ['isOnSale', 'On Sale', 'bg-orange-500'],
                ['isBestSeller', 'Best Seller', 'bg-purple-600'],
              ] as const).map(([field, label, activeColor]) => (
                <label key={field} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700">{label}</span>
                  <button
                    type="button"
                    onClick={() => toggle(field)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${editing[field] ? activeColor : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${editing[field] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </label>
              ))}
            </div>

            {saveError && (
              <p className="text-red-600 text-xs mb-3">{saveError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
