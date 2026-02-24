import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCheckout } from './CheckoutPage'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { isValidEmail } from '@/utils/validators'

export function CheckoutLoginPage() {
  const navigate = useNavigate()
  const { state: authState, login, register } = useAuth()
  const { setGuestEmail } = useCheckout()

  const [mode, setMode] = useState<'login' | 'guest' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Guest form
  const [guestEmail, setGuestEmailInput] = useState('')
  const [guestError, setGuestError] = useState('')

  // Register form
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regAcceptTerms, setRegAcceptTerms] = useState(false)
  const [registerError, setRegisterError] = useState('')

  // If already logged in, proceed to next step
  if (authState.isAuthenticated) {
    return <Navigate to="/checkout/address" replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter email and password')
      return
    }

    setIsLoading(true)
    const success = await login(loginEmail, loginPassword)
    setIsLoading(false)

    if (success) {
      navigate('/checkout/address')
    } else {
      setLoginError('Invalid email or password')
    }
  }

  const handleGuestCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setGuestError('')

    if (!guestEmail) {
      setGuestError('Please enter your email address')
      return
    }

    if (!isValidEmail(guestEmail)) {
      setGuestError('Please enter a valid email address')
      return
    }

    setGuestEmail(guestEmail)
    navigate('/checkout/address')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')

    if (!regFirstName || !regLastName || !regEmail || !regPhone || !regPassword || !regConfirmPassword) {
      setRegisterError('Please fill in all fields')
      return
    }

    if (!isValidEmail(regEmail)) {
      setRegisterError('Please enter a valid email address')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setRegisterError('Passwords do not match')
      return
    }

    if (regPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters')
      return
    }

    if (!regAcceptTerms) {
      setRegisterError('Please accept the Terms of Service')
      return
    }

    setIsLoading(true)
    const success = await register({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      confirmPassword: regConfirmPassword,
    })
    setIsLoading(false)

    if (success) {
      navigate('/checkout/address')
    } else {
      setRegisterError(authState.error || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold text-dark mb-6">Account</h2>

      {/* Mode Tabs */}
      <div className="flex gap-4 mb-6 border-b border-light-border">
        <button
          onClick={() => setMode('login')}
          className={`pb-3 px-1 font-medium border-b-2 -mb-px transition-colors ${
            mode === 'login'
              ? 'border-primary-orange text-primary-orange'
              : 'border-transparent text-dark-muted hover:text-dark'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('guest')}
          className={`pb-3 px-1 font-medium border-b-2 -mb-px transition-colors ${
            mode === 'guest'
              ? 'border-primary-orange text-primary-orange'
              : 'border-transparent text-dark-muted hover:text-dark'
          }`}
        >
          Guest Checkout
        </button>
        <button
          onClick={() => setMode('register')}
          className={`pb-3 px-1 font-medium border-b-2 -mb-px transition-colors ${
            mode === 'register'
              ? 'border-primary-orange text-primary-orange'
              : 'border-transparent text-dark-muted hover:text-dark'
          }`}
        >
          Register
        </button>
      </div>

      {/* Login Form */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />

          {loginError && (
            <p className="text-sm text-error">{loginError}</p>
          )}

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <a href="#" className="text-sm text-primary-orange hover:underline">
              Forgot Password?
            </a>
          </div>

          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            Login & Continue
          </Button>
        </form>
      )}

      {/* Guest Checkout Form */}
      {mode === 'guest' && (
        <form onSubmit={handleGuestCheckout} className="space-y-4">
          <p className="text-dark-muted mb-4">
            Continue as a guest. You can create an account after completing your order.
          </p>

          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={guestEmail}
            onChange={(e) => setGuestEmailInput(e.target.value)}
            error={guestError}
            helperText="We'll send order confirmation to this email"
            required
          />

          <Button type="submit" fullWidth size="lg">
            Continue as Guest
          </Button>
        </form>
      )}

      {/* Register Form */}
      {mode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <p className="text-dark-muted mb-4">
            Create an account to track orders, save addresses, and checkout faster.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              value={regFirstName}
              onChange={(e) => setRegFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={regLastName}
              onChange={(e) => setRegLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+94 7X XXX XXXX"
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={regConfirmPassword}
            onChange={(e) => setRegConfirmPassword(e.target.value)}
            required
          />

          {registerError && (
            <p className="text-sm text-error">{registerError}</p>
          )}

          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            checked={regAcceptTerms}
            onChange={(e) => setRegAcceptTerms(e.target.checked)}
          />

          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            Register & Continue
          </Button>
        </form>
      )}
    </div>
  )
}
