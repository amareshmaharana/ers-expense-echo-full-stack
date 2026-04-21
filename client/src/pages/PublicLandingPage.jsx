import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileUp,
  CheckCircle2,
  Clock,
  CreditCard,
  Shield,
  Zap,
  Users,
  BarChart3,
  Lock,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    name: "Employee",
    icon: FileUp,
    desc: "Submit claims with receipts",
    color: "from-cyan-500",
  },
  {
    name: "Manager",
    icon: CheckCircle2,
    desc: "Review submissions",
    color: "from-purple-500",
  },
  {
    name: "Director",
    icon: Clock,
    desc: "Authorize spending",
    color: "from-blue-500",
  },
  {
    name: "Accountant",
    icon: CreditCard,
    desc: "Process payments",
    color: "from-emerald-500",
  },
  {
    name: "Admin",
    icon: Shield,
    desc: "Oversee all users",
    color: "from-pink-500",
  },
];

const roleDetails = {
  Employee: {
    title: "Employee Access",
    summary:
      "Submit bills, upload receipts, and track the full approval trail in a clean workspace.",
    points: [
      "Drag-and-drop receipt upload",
      "Live status tracker",
      "Personal reimbursement history",
    ],
  },
  Manager: {
    title: "Manager Access",
    summary:
      "Review submitted claims quickly and approve or reject with contextual notes.",
    points: ["Approval queue", "Receipt preview", "Rejection comments"],
  },
  Director: {
    title: "Director Access",
    summary:
      "Authorize high-value claims with an executive overview of what reached the final stage.",
    points: [
      "Executive review list",
      "Approval timeline",
      "Audit-friendly visibility",
    ],
  },
  Accountant: {
    title: "Accountant Access",
    summary:
      "Process accepted bills and move them into reimbursement with financial clarity.",
    points: [
      "Awaiting payment list",
      "Pay Now actions",
      "Monthly payout metrics",
    ],
  },
  Admin: {
    title: "Admin Access",
    summary:
      "Control registrations, users, and organizational access from a security-first panel.",
    points: [
      "Approve employee onboarding",
      "Activity feed",
      "User management actions",
    ],
  },
};

const timeline = [
  { step: "Bill Submission", desc: "Employee uploads receipt" },
  { step: "Manager Approval", desc: "First review layer" },
  { step: "Director Auth", desc: "Business validation" },
  { step: "Disbursement", desc: "Accountant pays out" },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    text: "Real-time approvals and notifications",
  },
  {
    icon: Shield,
    title: "Secure & Audited",
    text: "Full protected, full compliance",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    text: "Track spend across teams",
  },
];

const testimonials = [
  {
    name: "Maya Thompson",
    role: "Operations Manager",
    quote:
      "ExpenseEcho feels like it was designed for people who actually use it every day. The dashboard stays calm, the approvals are easy to follow, and the whole reimbursement process feels modern instead of bureaucratic.",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
  {
    name: "David Chen",
    role: "Finance Lead",
    quote:
      "The payout view is exactly what finance needed. It is organized, readable, and makes disbursement simple to manage.",
    accent: "from-emerald-500/20 to-emerald-500/10",
  },
  {
    name: "Priya Sharma",
    role: "Employee",
    quote:
      "Submitting a reimbursement is straightforward and the live timeline makes it easy to know what is happening next.",
    accent: "from-purple-500/20 to-fuchsia-500/10",
  },
  {
    name: "Alex Morgan",
    role: "Team Lead",
    quote:
      "The review queue is crisp and actionable. I can close approvals faster without jumping through multiple screens.",
    accent: "from-sky-500/20 to-cyan-500/10",
  },
  {
    name: "Sara Ali",
    role: "HR Coordinator",
    quote:
      "New employees picked this up immediately. The flow feels intuitive and support requests dropped noticeably.",
    accent: "from-rose-500/20 to-orange-500/10",
  },
  {
    name: "Noah Patel",
    role: "Accounting Analyst",
    quote:
      "Payment tracking is clear and predictable. Month-end reconciliation is much easier with this workflow.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    name: "Ishita Rao",
    role: "Director",
    quote:
      "I can quickly review high-value claims and approve with confidence because every step is visible and well organized.",
    accent: "from-indigo-500/20 to-blue-500/10",
  },
  {
    name: "Ethan Brooks",
    role: "Project Manager",
    quote:
      "The dashboard gives exactly what I need at a glance. It feels modern, focused, and genuinely saves time each week.",
    accent: "from-amber-500/20 to-yellow-500/10",
  },
];

const PublicLandingPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [activeRole, setActiveRole] = useState(null);
  const testimonialRailRef = useRef(null);
  const activeRoleData = activeRole ? roleDetails[activeRole] : null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const scrollTestimonials = (direction) => {
    if (!testimonialRailRef.current) {
      return;
    }

    testimonialRailRef.current.scrollBy({
      left: direction === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  return (
    <div id="top" className="min-h-screen bg-primary text-white overflow-hidden">
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />

      <header className="sticky top-0 z-50 backdrop-blur-glass border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-3 items-center gap-4">
          <div className="flex items-center gap-2 justify-self-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold">
              EE
            </div>
            <span className="font-semibold hidden sm:inline">
              ExpenseEcho
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-2">
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] border border-transparent text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/learn"
              className="rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] border border-transparent text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] border border-transparent text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-2 justify-self-end">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] border border-transparent text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="glow-button bg-gradient-to-r from-cyan-500 to-purple-500 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em]"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <section className="text-center mb-32">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Modern Expense</span>
            <br />
            <span className="gradient-text">Management</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Streamline your entire reimbursement workflow with intelligent
            approvals, real-time tracking, and instant payouts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="glow-button bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center gap-2"
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link
              to="/learn"
              className="px-6 py-3 rounded-lg font-semibold border border-white/20 hover:border-white/40 transition"
            >
              Learn More
            </Link>
          </div>
        </section>

        <section className="mb-32 grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:border-white/20 transition"
            >
              <feature.icon size={28} className="text-cyan-400 mb-4" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.text}</p>
            </div>
          ))}
        </section>

        <section id="features" className="mb-32">
          <h2 className="text-3xl font-bold mb-16 text-center">
            The Complete Workflow
          </h2>

          {/* Desktop Timeline - Horizontal */}
          <div className="hidden md:block">
            <div className="flex items-start gap-8">
              {timeline.map((item, idx) => (
                <div key={item.step} className="flex-1 relative">
                  {/* Connector Line */}
                  {idx < timeline.length - 1 && (
                    <div className="absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-500 to-purple-500 transform -translate-y-1/2" />
                  )}

                  {/* Card */}
                  <div className="glass-card p-6 text-center relative z-10">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold mb-2">{item.step}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline - Vertical */}
          <div className="md:hidden space-y-4">
            {timeline.map((item, idx) => (
              <div key={item.step} className="flex gap-4">
                {/* Vertical Connector */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-white">{item.step}</h3>
                  <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Role-Based Access
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {roles.map((role) => (
              <button
                key={role.name}
                type="button"
                onClick={() => setActiveRole(role.name)}
                className="glass-card p-6 hover:border-cyan-500/50 transition group text-left w-full relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:shadow-glow">
                  <ArrowRight
                    size={16}
                    className="text-cyan-300 group-hover:text-white transition-transform group-hover:translate-x-0.5"
                  />
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} to-transparent p-2.5 mb-4`}
                >
                  <role.icon size={20} />
                </div>
                <h3 className="font-semibold mb-2">{role.name}</h3>
                <p className="text-sm text-gray-400">{role.desc}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-gray-500">
                  Click to view details
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Dashboard Preview
          </h2>
          <div className="glass-card p-8 lg:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Upload Receipt</h3>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                    dragActive
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <FileUp size={40} className="mx-auto mb-4 text-cyan-400" />
                  <p className="font-semibold mb-2">Drag receipts here</p>
                  <p className="text-sm text-gray-400">or click to browse</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Recent Claims</h3>
                <div className="space-y-3">
                  {[
                    {
                      title: "Client dinner",
                      amount: "$245",
                      status: "Approved",
                    },
                    {
                      title: "Travel expenses",
                      amount: "$1,250",
                      status: "Pending",
                    },
                    { title: "Office supplies", amount: "$89", status: "Paid" },
                  ].map((claim) => (
                    <div
                      key={claim.title}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div>
                        <p className="font-medium text-sm">{claim.title}</p>
                        <p className="text-xs text-gray-500">{claim.amount}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          claim.status === "Approved"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : claim.status === "Pending"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-cyan-500/20 text-cyan-400"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-32">
          <div className="mb-12 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold">What Users Say</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTestimonials("left")}
                aria-label="Scroll testimonials left"
                className="h-11 w-11 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center transition hover:border-cyan-400/70 hover:bg-cyan-500/20"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollTestimonials("right")}
                aria-label="Scroll testimonials right"
                className="h-11 w-11 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center transition hover:border-cyan-400/70 hover:bg-cyan-500/20"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-primary to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-primary to-transparent z-10" />

            <div
              ref={testimonialRailRef}
              className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
            >
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className={`w-[360px] h-[232px] snap-start glass-card p-5 bg-gradient-to-br ${item.accent} shrink-0 overflow-hidden`}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {item.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.12em] text-gray-500 truncate">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 max-h-[132px] overflow-hidden text-sm leading-relaxed text-gray-200">
                      {item.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">
            Ready to streamline expenses?
          </h2>
          <p className="text-gray-400 mb-8">
            Start managing reimbursements like a modern tech company.
          </p>
          <Link
            to="/login"
            className="glow-button bg-gradient-to-r from-cyan-500 to-purple-500 inline-flex items-center gap-2"
          >
            Access the System <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/10 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-semibold mb-4">Product</div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Dashboard</p>
                <p>Security</p>
                <p>Integrations</p>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-4">Company</div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>About</p>
                <p>Blog</p>
                <p>Careers</p>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-4">Resources</div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Docs</p>
                <p>API</p>
                <p>Support</p>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-4">Legal</div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Privacy</p>
                <p>Terms</p>
                <p>Security</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 ExpenseEcho Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {activeRole && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveRole(null)}
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-[#0b0b0d] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                  Role Preview
                </p>
                <h3 className="text-3xl font-semibold text-white">
                  {activeRoleData.title}
                </h3>
                <p className="mt-3 max-w-xl text-gray-300">
                  {activeRoleData.summary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRole(null)}
                className="rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {activeRoleData.points.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-gray-200"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">
                Click outside this card or press Close to dismiss
              </p>
              <button
                type="button"
                onClick={() => setActiveRole(null)}
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLandingPage;
