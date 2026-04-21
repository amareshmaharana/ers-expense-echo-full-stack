import { LogOut, Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AppShell = ({ title, subtitle, children, navItems = [], notificationCount = 0, accent = 'cyan' }) => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const rolePath = `/${(user?.role || 'employee').toLowerCase()}`

  const normalizedNavItems = (navItems.length > 0 ? navItems : [{ label: 'Overview', to: `${rolePath}/dashboard` }]).map((item) => (
    typeof item === 'string' ? { label: item, to: null } : item
  ))

  const accentBadge = {
    cyan: 'from-cyan-500 to-blue-500',
    green: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    purple: 'from-violet-500 to-fuchsia-500',
  }[accent]

  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accentBadge} flex items-center justify-center text-sm font-bold sm:flex`}>
                EE
              </div>
              <div>
                <h1 className="font-bold text-lg hidden sm:block">{title}</h1>
                <p className="text-xs text-gray-400 hidden sm:block">{user?.role}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-2">
              {[
                { to: '/', label: 'Home' },
                { to: `${rolePath}/dashboard`, label: 'Dashboard' },
                { to: `${rolePath}/reports`, label: 'Reports' },
                { to: `${rolePath}/settings`, label: 'Settings' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `px-3 py-2 rounded-lg text-xs uppercase tracking-[0.12em] transition ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition" aria-label="Notifications">
              <Bell size={18} className="text-gray-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold px-1.5 flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm">{user?.fullName}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 hover:bg-white/10 rounded-lg transition text-red-400 hover:text-red-300"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-start gap-6">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-16 left-0 w-64 glass-card p-6 transform transition-transform md:relative md:translate-x-0 md:inset-auto md:w-64 md:flex md:flex-col md:justify-between md:self-start md:h-fit
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          z-30 md:z-0
        `}>
          <div className="space-y-6">
            <div className="hidden md:block">
              <h3 className="text-sm font-semibold mb-4">Dashboard</h3>
              <nav className="space-y-2">
                {normalizedNavItems.map((item, index) => (
                  <NavLink
                    key={`${item.label}-${index}`}
                    to={item.to || `${rolePath}/dashboard`}
                    className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive || index === 0
                        ? `bg-gradient-to-r ${accentBadge} text-white`
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="glass-card p-4 border-cyan-500/20">
              <p className="text-xs text-gray-400 uppercase mb-2">Profile</p>
              <p className="font-semibold text-sm mb-1">{user?.fullName}</p>
              <p className="text-sm text-cyan-300 mb-2">{user?.role}</p>
              <p className="text-xs text-gray-400">{user?.department}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase mb-3">Quick Links</p>
              <div className="space-y-2">
                {normalizedNavItems.slice(0, 3).map((item, index) => (
                  <NavLink
                    key={`${item.label}-quick-${index}`}
                    to={item.to || `${rolePath}/dashboard`}
                    className="block px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:border-white/30 transition"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="mt-6 w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="glass-card p-6 sm:p-8 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-gray-400 text-lg">{subtitle}</p>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
