import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ersIllustration from '../assets/hero.png'

const PublicAboutPage = () => {
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
            ABOUT OF SYS
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

        <section className="glass-card p-8 lg:p-12 mb-12">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 items-center">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <img
                src={ersIllustration}
                alt="ExpenseEcho Platform Overview"
                className="w-full h-[260px] sm:h-[320px] object-cover rounded-xl"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-4">About ExpenseEcho</p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
                A Professional Reimbursement Platform For Modern Organizations
              </h1>
              <p className="text-gray-300 leading-relaxed mb-4">
                ExpenseEcho is built to standardize and accelerate how organizations process operational expenses. Instead of fragmented email approvals and manual follow-ups, ExpenseEcho offers a structured, role-driven workflow with clear accountability at every step.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Employees can submit claims with supporting receipts in minutes, managers and directors can review requests with complete context, and finance teams can execute payouts from a single operational workspace. This reduces approval latency, strengthens policy compliance, and improves the audit-readiness of every transaction.
              </p>
              <p className="text-gray-300 leading-relaxed">
                For organizations, ExpenseEcho provides transparency, consistency, and measurable process control. Teams gain confidence through visibility, leaders gain control through governance, and finance gains operational efficiency through standardized disbursement workflows.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mb-16">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Operational Clarity</h3>
            <p className="text-sm text-gray-400">Every reimbursement has a visible lifecycle from submission to payout with clear status ownership.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Policy Discipline</h3>
            <p className="text-sm text-gray-400">Role-based approvals ensure each claim is validated according to organizational hierarchy and controls.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-2">Financial Efficiency</h3>
            <p className="text-sm text-gray-400">Accountant-first disbursement tooling helps teams settle approved claims faster and with better oversight.</p>
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
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 ExpenseEcho Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicAboutPage
