import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import { useAuth } from '../context/AuthContext'
import http from '../api/http'

const sectionCopy = {
  reports: {
    title: 'Reports',
    subtitle: 'Role-scoped analytics and summaries for your workflow.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure profile, alerts, and workspace preferences.',
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Track important alerts and pending actions.',
  },
}

const roleAccent = {
  Employee: 'cyan',
  Manager: 'green',
  Director: 'green',
  Accountant: 'amber',
  Admin: 'purple',
}

const RoleSectionPage = ({ section = 'reports' }) => {
  const { user } = useAuth()
  const { role } = useParams()
  const resolvedRole = role || user.role.toLowerCase()
  const copy = sectionCopy[section] || sectionCopy.reports
  const [activity, setActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)

  const isAdminActivitySection = user.role === 'Admin' && section === 'notifications'

  useEffect(() => {
    const loadActivity = async () => {
      if (!isAdminActivitySection) {
        return
      }

      setActivityLoading(true)
      try {
        const response = await http.get('/admin/users/activity', { params: { limit: 100 } })
        setActivity(response.data.data.events || [])
      } catch (error) {
        setActivity([])
      } finally {
        setActivityLoading(false)
      }
    }

    loadActivity()
  }, [isAdminActivitySection])

  const navItems = [
    { label: 'Dashboard', to: `/${resolvedRole}/dashboard` },
    { label: 'Reports', to: `/${resolvedRole}/reports` },
    { label: 'Settings', to: `/${resolvedRole}/settings` },
  ]

  return (
    <AppShell
      title={`${user.role} ${copy.title}`}
      subtitle={copy.subtitle}
      navItems={navItems}
      accent={roleAccent[user.role] || 'cyan'}
    >
      {isAdminActivitySection ? (
        <section className="glass-card p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">System Activity Feed</h2>
            <span className="text-xs uppercase tracking-[0.12em] text-gray-500">Auto-retained for 7 days</span>
          </div>

          {activityLoading ? (
            <p className="text-sm text-gray-400">Loading activity...</p>
          ) : activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((event) => (
                <div key={event.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{event.label}</p>
                      <p className="mt-1 text-xs text-gray-400">{event.meta}</p>
                    </div>
                    <p className="text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(event.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No activity found in the last 7 days.</p>
          )}
        </section>
      ) : (
        <section className="glass-card p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">{copy.title} Workspace</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            This route is active and role-scoped. Add your role-specific {copy.title.toLowerCase()} widgets here.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to={`/${resolvedRole}/dashboard`} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-sm">
              Back to Dashboard
            </Link>
            <Link to={`/${resolvedRole}/settings`} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-sm">
              Open Settings
            </Link>
          </div>
        </section>
      )}
    </AppShell>
  )
}

export default RoleSectionPage
