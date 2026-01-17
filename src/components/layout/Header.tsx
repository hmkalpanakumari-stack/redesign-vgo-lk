import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { categories } from '@/data/categories'
import { announcementBar } from '@/data/content'
import { Input } from '@/components/ui/Input'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const navigate = useNavigate()

  const { itemCount } = useCart()
  const { state: authState, logout } = useAuth()
  const { toggleCartDrawer } = useUI()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-primary-orange text-white py-2">
        <div className="container flex items-center justify-center gap-2 text-sm">
          <span>{announcementBar.message}</span>
          <Link to={announcementBar.link} className="underline font-medium hover:no-underline">
            {announcementBar.linkText}
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-3">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold">
              <span className="text-primary-orange">VGO</span>
              <span className="text-primary-blue">.lk</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-orange text-white rounded-lg hover:bg-primary-orange-hover"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* User Menu */}
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:inline text-sm font-medium">
                  {authState.isAuthenticated ? authState.user?.firstName : 'Account'}
                </span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-dropdown py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                {authState.isAuthenticated ? (
                  <>
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">My Account</Link>
                    <Link to="/account/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">My Orders</Link>
                    <Link to="/account/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-100">Wishlist</Link>
                    <hr className="my-2 border-light-border" />
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-error">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/checkout" className="block px-4 py-2 text-sm hover:bg-gray-100">Login</Link>
                    <Link to="/checkout" className="block px-4 py-2 text-sm hover:bg-gray-100">Register</Link>
                  </>
                )}
              </div>
            </div>

            {/* Wishlist */}
            <Link to="/account/wishlist" className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCartDrawer}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </form>
      </div>

      {/* Category Navigation */}
      <nav className="hidden lg:block border-t border-light-border bg-light-bg">
        <div className="container">
          <ul className="flex items-center gap-1">
            {/* All Categories Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setShowCategoryMenu(true)}
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <button className="flex items-center gap-2 px-4 py-3 font-medium text-primary-blue hover:text-primary-blue-hover">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Categories
                <svg className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Menu */}
              {showCategoryMenu && (
                <div className="absolute left-0 top-full w-[800px] bg-white rounded-b-lg shadow-dropdown p-6 grid grid-cols-3 gap-6">
                  {categories.map(category => (
                    <div key={category.id}>
                      <Link
                        to={`/products/${category.slug}`}
                        className="flex items-center gap-2 font-semibold text-dark hover:text-primary-orange mb-2"
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </Link>
                      {category.children && (
                        <ul className="space-y-1 ml-6">
                          {category.children.map(child => (
                            <li key={child.id}>
                              <Link
                                to={`/products/${child.slug}`}
                                className="text-sm text-dark-muted hover:text-primary-orange"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>

            {/* Quick Links */}
            <li>
              <Link to="/products?sale=true" className="px-4 py-3 text-sm font-medium text-dark hover:text-primary-orange flex items-center gap-1">
                Flash Deals
                <span className="text-xs bg-error text-white px-1.5 py-0.5 rounded-full">Hot</span>
              </Link>
            </li>
            <li>
              <Link to="/products?new=true" className="px-4 py-3 text-sm font-medium text-dark hover:text-primary-orange">
                New Arrivals
              </Link>
            </li>
            {categories.slice(0, 4).map(category => (
              <li key={category.id}>
                <Link
                  to={`/products/${category.slug}`}
                  className="px-4 py-3 text-sm font-medium text-dark hover:text-primary-orange"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-light-border bg-white">
          <nav className="container py-4">
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <Link
                    to={`/products/${category.slug}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
