import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { adminService } from '@/services/adminService';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/orders', label: 'Orders', icon: '📦', end: false },
  { to: '/admin/products', label: 'Products', icon: '🛍️', end: true },
  { to: '/admin/products/add', label: 'Add Product', icon: '➕', end: false },
  { to: '/admin/users', label: 'Users', icon: '👥', end: false },
];

export function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Register callback so API 401/403 redirects use React Router (no hard reload)
    adminService.setUnauthorizedCallback(() => navigate('/admin/login'));
    return () => adminService.clearUnauthorizedCallback();
  }, [navigate]);

  // Immediate redirect if no token — no flash of content
  if (!adminService.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    adminService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="text-lg font-bold text-blue-600">VGO Admin</div>
          <div className="text-xs text-gray-400">Management Panel</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
