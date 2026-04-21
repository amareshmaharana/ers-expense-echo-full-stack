import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerColumns = [
  {
    title: 'Product',
    items: ['Dashboard', 'Security', 'Integrations'],
  },
  {
    title: 'Company',
    items: ['About', 'Blog', 'Careers'],
  },
  {
    title: 'Resources',
    items: ['Docs', 'API', 'Support'],
  },
  {
    title: 'Legal',
    items: ['Privacy', 'Terms', 'Security'],
  },
]

const PublicLearnPage = () => {
  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden">
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />

      <header className="sticky top-0 z-50 backdrop-blur-glass border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-3 items-center gap-4">
          <Link to="/" className="flex items-center gap-2 justify-self-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold">
              EE
            </div>
            <span className="font-semibold hidden sm:inline">ExpenseEcho</span>
          </Link>

          <p className="hidden md:block text-center text-xs uppercase tracking-[0.2em] text-gray-300">
            LEARN OUR WORKFLOW
          </p>

          <div className="flex items-center gap-2 justify-self-end">
            <Link to="/login" className="rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] border border-transparent text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="glow-button bg-gradient-to-r from-cyan-500 to-purple-500 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em]">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.12em] text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>

        <section className="glass-card p-8 lg:p-12 mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-4">ExpenseEcho Documentation</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">ExpenseEcho Technical Overview</h1>
          <p className="mt-5 text-gray-300 max-w-3xl leading-relaxed">
            The ExpenseEcho portal provides a complete reimbursement lifecycle for organizations, from expense submission to approval and payout. It is designed to reduce turnaround time, strengthen audit readiness, and improve policy compliance across departments.
          </p>
        </section>

        <section id="features" className="grid lg:grid-cols-2 gap-6 mb-10">
          <article className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-3">Core Modules</h2>
            <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
              <li>Employee claim submission with receipt attachment</li>
              <li>Manager and Director approval checkpoints</li>
              <li>Accountant disbursement processing and payout tracking</li>
              <li>Admin access control and system activity oversight</li>
            </ul>
          </article>

          <article className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-3">Governance And Security</h2>
            <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
              <li>Role-based authorization and protected API routes</li>
              <li>JWT authentication with secure session handling</li>
              <li>Structured timeline and status tracking for each claim</li>
              <li>Activity feed visibility for operational monitoring</li>
            </ul>
          </article>
        </section>

        <section className="glass-card p-6 lg:p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Workflow Diagram</h2>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-sm font-semibold">1. Submit</p>
              <p className="text-xs text-gray-400 mt-1">Employee files claim</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-sm font-semibold">2. Manager Review</p>
              <p className="text-xs text-gray-400 mt-1">Initial policy check</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-sm font-semibold">3. Director Authorization</p>
              <p className="text-xs text-gray-400 mt-1">Final approval stage</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-sm font-semibold">4. Disbursement</p>
              <p className="text-xs text-gray-400 mt-1">Accountant processes payout</p>
            </div>
          </div>
        </section>

        <section className="glass-card p-6 lg:p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Operational Workflow Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10 text-gray-400">
                  <th className="py-3 pr-4">Stage</th>
                  <th className="py-3 pr-4">Primary Role</th>
                  <th className="py-3 pr-4">Outcome</th>
                  <th className="py-3">System Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Submission</td>
                  <td className="py-3 pr-4">Employee</td>
                  <td className="py-3 pr-4">Expense request created</td>
                  <td className="py-3">Submitted</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">First Approval</td>
                  <td className="py-3 pr-4">Manager</td>
                  <td className="py-3 pr-4">Manager decision recorded</td>
                  <td className="py-3">ManagerApproved or Rejected</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Final Authorization</td>
                  <td className="py-3 pr-4">Director</td>
                  <td className="py-3 pr-4">Final business authorization</td>
                  <td className="py-3">DirectorApproved or Rejected</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Payout</td>
                  <td className="py-3 pr-4">Accountant</td>
                  <td className="py-3 pr-4">Funds released and ledger updated</td>
                  <td className="py-3">Paid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Ready to streamline expenses?</h2>
          <p className="text-gray-400 mb-8">Start managing reimbursements like a modern tech company.</p>
          <Link to="/login" className="glow-button bg-gradient-to-r from-cyan-500 to-purple-500 inline-flex items-center gap-2">
            Access the System <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/10 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <div className="font-semibold mb-4">{column.title}</div>
                <div className="space-y-2 text-sm text-gray-400">
                  {column.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 ExpenseEcho Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLearnPage
