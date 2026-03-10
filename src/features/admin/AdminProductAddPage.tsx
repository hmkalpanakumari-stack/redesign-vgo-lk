import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, type CreateProductRequest } from '@/services/adminService';
import { API_BASE_URL } from '@/services/apiClient';

interface Category { id: string; name: string; }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function AdminProductAddPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<CreateProductRequest>({
    name: '', slug: '', description: '', shortDescription: '',
    categoryId: '', subCategory: '', brand: '', sku: '',
    stock: 0, price: 0, originalPrice: undefined, imageUrl: '',
    isFeatured: false, isNew: true, isOnSale: false, isBestSeller: false,
    warranty: '', deliveryInfo: '',
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(r => r.json())
      .then(d => setCategories((d.data || []).map((c: any) => ({ id: c.id, name: c.name }))));
  }, []);

  const set = (field: keyof CreateProductRequest, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.categoryId) { setError('Please select a category'); return; }
    setSaving(true);
    try {
      await adminService.createProduct({
        ...form,
        originalPrice: form.originalPrice || undefined,
        imageUrl: form.imageUrl || undefined,
      });
      setSuccess('Product created successfully!');
      setTimeout(() => navigate('/admin/products', { replace: true }), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products', { replace: true })} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">Add Product</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Basic Information</div>

          <Field label="Product Name *">
            <input
              className={inputCls} required value={form.name}
              onChange={e => { set('name', e.target.value); set('slug', autoSlug(e.target.value)); }}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug *">
              <input className={inputCls} required value={form.slug}
                onChange={e => set('slug', e.target.value)} />
            </Field>
            <Field label="SKU *">
              <input className={inputCls} required value={form.sku}
                onChange={e => set('sku', e.target.value)} />
            </Field>
          </div>

          <Field label="Description *">
            <textarea className={inputCls} rows={3} required value={form.description}
              onChange={e => set('description', e.target.value)} />
          </Field>

          <Field label="Short Description">
            <input className={inputCls} value={form.shortDescription}
              onChange={e => set('shortDescription', e.target.value)} />
          </Field>
        </div>

        {/* Category & Brand */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Category & Brand</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category *">
              <select className={inputCls} required value={form.categoryId}
                onChange={e => set('categoryId', e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Sub Category">
              <input className={inputCls} value={form.subCategory}
                onChange={e => set('subCategory', e.target.value)} />
            </Field>
            <Field label="Brand">
              <input className={inputCls} value={form.brand}
                onChange={e => set('brand', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Pricing & Stock</div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (LKR) *">
              <input type="number" min={0} className={inputCls} required value={form.price}
                onChange={e => set('price', parseFloat(e.target.value) || 0)} />
            </Field>
            <Field label="Original Price (LKR)">
              <input type="number" min={0} className={inputCls}
                value={form.originalPrice ?? ''}
                onChange={e => set('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)} />
            </Field>
            <Field label="Stock *">
              <input type="number" min={0} className={inputCls} required value={form.stock}
                onChange={e => set('stock', parseInt(e.target.value) || 0)} />
            </Field>
          </div>
        </div>

        {/* Image & Extra */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Image & Details</div>
          <Field label="Image URL">
            <input className={inputCls} placeholder="https://... or /products/image.jpg"
              value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Warranty">
              <input className={inputCls} placeholder="e.g. 1 Year Warranty"
                value={form.warranty} onChange={e => set('warranty', e.target.value)} />
            </Field>
            <Field label="Delivery Info">
              <input className={inputCls} placeholder="e.g. 2-3 business days"
                value={form.deliveryInfo} onChange={e => set('deliveryInfo', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-semibold text-gray-700 mb-3">Product Tags</div>
          <div className="grid grid-cols-2 gap-3">
            {([
              ['isFeatured', 'Featured'],
              ['isNew', 'New Arrival'],
              ['isOnSale', 'On Sale'],
              ['isBestSeller', 'Best Seller'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form[key]}
                  onChange={e => set(key, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors">
            {saving ? 'Creating...' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products', { replace: true })}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg text-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
