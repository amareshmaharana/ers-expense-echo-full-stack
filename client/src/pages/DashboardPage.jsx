import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, FilePlus2, X } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import StatusTimeline from "../components/dashboard/StatusTimeline";
import ReimbursementForm from "../components/dashboard/ReimbursementForm";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";

const defaultOverview = {
  totals: { totalAmount: 0, count: 0 },
  byStatus: [],
  latest: [],
};

const roleConfig = {
  Employee: {
    accent: "cyan",
    title: "Employee Dashboard",
    subtitle: (name) =>
      `Welcome, ${name}. Submit reimbursement claims with confidence and track every stage with clarity.`,
    nav: ["Submit Bill", "Status Tracker", "History Ledger"],
    gradient: "from-blue-500/20 to-slate-500/5",
  },
  Manager: {
    accent: "green",
    title: "Manager Dashboard",
    subtitle: (name) =>
      `Welcome, ${name}. Review pending claims efficiently and make informed approval decisions.`,
    nav: ["Approval Queue", "Decision Feed", "Reports"],
    gradient: "from-emerald-500/20 to-slate-500/5",
  },
  Director: {
    accent: "green",
    title: "Director Dashboard",
    subtitle: (name) =>
      `Welcome, ${name}. Authorize high-value reimbursements with policy-aligned executive oversight.`,
    nav: ["Executive Queue", "Decision Feed", "Reports"],
    gradient: "from-emerald-500/20 to-black/10",
  },
  Accountant: {
    accent: "amber",
    title: "Accountant Dashboard",
    subtitle: (name) =>
      `Welcome, ${name}. Process approved payouts accurately with complete financial visibility.`,
    nav: ["Awaiting Payment", "Disbursement", "Finance Summary"],
    gradient: "from-amber-500/20 to-zinc-500/5",
  },
  Admin: {
    accent: "purple",
    title: "Admin Dashboard",
    subtitle: (name) =>
      `Welcome, ${name}. Manage users, permissions, and platform activity from a single control center.`,
    nav: ["User Management", "Activity Feed", "System Oversight"],
    gradient: "from-violet-500/20 to-black/20",
  },
};

const statusTone = {
  Submitted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  ManagerApproved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  DirectorApproved: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Paid: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Rejected: "bg-red-500/20 text-red-300 border-red-500/30",
};

const money = (value) => `$${Number(value || 0).toLocaleString()}`;

const DashboardPage = () => {
  const { user } = useAuth();
  const rolePath = `/${user.role.toLowerCase()}`;
  const [overview, setOverview] = useState(defaultOverview);
  const [reimbursements, setReimbursements] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [receiptPreviewTarget, setReceiptPreviewTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

  const selected =
    reimbursements.find((item) => item._id === selectedId) ||
    reimbursements[0] ||
    null;
  const config = roleConfig[user.role] || roleConfig.Employee;
  const subtitle =
    typeof config.subtitle === "function"
      ? config.subtitle(user.fullName || "User")
      : config.subtitle;
  const navItems = [
    { label: config.nav[0], to: `${rolePath}/dashboard` },
    { label: config.nav[1], to: `${rolePath}/reports` },
    { label: config.nav[2], to: `${rolePath}/settings` },
  ];

  const queue = useMemo(
    () =>
      reimbursements.filter((item) => {
        if (user.role === "Manager") return item.status === "Submitted";
        if (user.role === "Director") return item.status === "ManagerApproved";
        if (user.role === "Accountant")
          return item.status === "DirectorApproved";
        return true;
      }),
    [reimbursements, user.role],
  );

  const inactiveUsers = useMemo(
    () => adminUsers.filter((item) => !item.active),
    [adminUsers],
  );

  const paidThisMonthTotal = useMemo(
    () =>
      reimbursements
        .filter((item) => item.status === "Paid")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [reimbursements],
  );

  const pendingDisbursementTotal = useMemo(
    () =>
      reimbursements
        .filter((item) => item.status === "DirectorApproved")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [reimbursements],
  );

  const notificationCount = useMemo(() => {
    if (user.role === "Admin") return inactiveUsers.length;
    if (user.role === "Employee")
      return reimbursements.filter((item) => item.status === "Rejected").length;
    return queue.length;
  }, [inactiveUsers.length, queue.length, reimbursements, user.role]);

  const loadDashboard = async () => {
    try {
      const requests = [
        http.get("/dashboard/summary"),
        http.get("/reimbursements"),
      ];
      if (user.role === "Admin") {
        requests.push(http.get("/admin/users"));
        requests.push(http.get("/admin/users/activity", { params: { limit: 100 } }));
      }

      const [summaryResponse, listResponse, usersResponse, activityResponse] =
        await Promise.all(requests);

      setOverview(summaryResponse.data.data);
      setReimbursements(listResponse.data.data.reimbursements);
      setSelectedId(listResponse.data.data.reimbursements[0]?._id || null);
      if (usersResponse) {
        setAdminUsers(usersResponse.data.data.users);
      }
      if (activityResponse) {
        setActivityFeed(activityResponse.data.data.events || []);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setOverview(defaultOverview);
      setReimbursements([]);
      setAdminUsers([]);
      setActivityFeed([]);
      setNotice(
        "Backend is offline or unseeded. Connect MongoDB and create demo users to unlock live data.",
      );
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user.role]);

  const countByStatus = (status) =>
    overview.byStatus.find((item) => item._id === status)?.count || 0;

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  };

  const handleSubmitted = async () => {
    showNotice("Claim submitted. Awaiting manager review.");
    await loadDashboard();
  };

  const handleReview = async (id, action, extra = {}) => {
    try {
      await http.patch(`/reimbursements/${id}/review`, { action, ...extra });
      showNotice(`Request marked as ${action.toLowerCase()}.`);
      await loadDashboard();
    } catch (error) {
      showNotice("Unable to process this request right now.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectTarget) return;
    setSubmittingReject(true);
    await handleReview(rejectTarget._id, "Rejected", {
      comment: rejectComment.trim() || "Rejected with no comment.",
    });
    setSubmittingReject(false);
    setRejectComment("");
    setRejectTarget(null);
  };

  const renderStatCards = () => (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <div className={`glass-card p-5 bg-gradient-to-br ${config.gradient}`}>
        <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
          Total Claims
        </p>
        <p className="text-3xl font-semibold mt-2">
          {overview.totals.count || reimbursements.length || 0}
        </p>
      </div>
      <div className={`glass-card p-5 bg-gradient-to-br ${config.gradient}`}>
        <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
          Total Value
        </p>
        <p className="text-3xl font-semibold mt-2">
          {money(overview.totals.totalAmount)}
        </p>
      </div>
      <div className={`glass-card p-5 bg-gradient-to-br ${config.gradient}`}>
        <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
          Pending Work
        </p>
        <p className="text-3xl font-semibold mt-2">
          {user.role === "Admin" ? inactiveUsers.length : queue.length}
        </p>
      </div>
      <div className={`glass-card p-5 bg-gradient-to-br ${config.gradient}`}>
        <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
          Completed
        </p>
        <p className="text-3xl font-semibold mt-2">{countByStatus("Paid")}</p>
      </div>
    </section>
  );

  const renderHistoryList = (items, title) => (
    <section className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-gray-500 uppercase tracking-[0.14em]">
          Action Ledger
        </p>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-[2fr_1fr_1fr] text-xs uppercase tracking-[0.14em] text-gray-500 px-3 py-2">
          <span>Claim</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Status</span>
        </div>
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelectedId(item._id)}
              className="w-full grid grid-cols-[2fr_1fr_1fr] gap-3 px-3 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/20 text-left"
            >
              <span className="truncate">{item.title}</span>
              <span className="text-right text-gray-300">
                {item.currency} {item.amount}
              </span>
              <span className="text-right">
                <span
                  className={`inline-flex px-2 py-1 rounded-lg border text-xs ${statusTone[item.status] || "bg-white/10 text-gray-300 border-white/20"}`}
                >
                  {item.status}
                </span>
              </span>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            No items available yet.
          </p>
        )}
      </div>
    </section>
  );

  const renderEmployee = () => (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FilePlus2 size={18} className="text-cyan-300" />
            <h3 className="text-lg font-semibold">Submit New Reimbursement</h3>
          </div>
          <ReimbursementForm onSubmitted={handleSubmitted} />
        </div>
        {renderHistoryList(reimbursements, "Past Reimbursements")}
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Status Tracker</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <span className="flex items-center gap-2 text-sm">
                <Clock3 size={15} className="text-amber-300" />
                Pending
              </span>
              <strong>{countByStatus("Submitted")}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <span className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={15} className="text-emerald-300" />
                Approved
              </span>
              <strong>
                {countByStatus("ManagerApproved") +
                  countByStatus("DirectorApproved")}
              </strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <span className="flex items-center gap-2 text-sm">
                <AlertCircle size={15} className="text-red-300" />
                Rejected
              </span>
              <strong>{countByStatus("Rejected")}</strong>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-3">
            Selected Claim Timeline
          </h3>
          {selected ? (
            <>
              <p className="text-sm text-gray-400 mb-3">{selected.title}</p>
              <StatusTimeline status={selected.status} />
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Select a reimbursement to inspect timeline.
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const renderApprovalQueue = () => (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Approval Queue</h3>
            <span className="text-xs uppercase tracking-[0.14em] text-gray-500">
              {queue.length} waiting
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {queue.length > 0 ? (
              queue.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-emerald-400/40 transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-400">
                        {item.employee?.fullName || "Unknown"} • {item.category}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {item.currency} {item.amount}
                    </p>
                  </div>

                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="text-xs text-gray-500 mb-4">
                    Receipt: {item.receipt?.fileName || "Not attached"}
                  </div>

                  {item.receipt?.url && (
                    <button
                      onClick={() => setReceiptPreviewTarget(item)}
                      className="w-full mb-3 rounded-lg border border-white/20 bg-white/[0.03] px-3 py-2 text-xs text-gray-200 hover:bg-white/[0.08]"
                    >
                      Preview Receipt
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(item._id, "Approved")}
                      className="flex-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3 py-2 text-sm hover:bg-emerald-500/30"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setRejectTarget(item)}
                      className="flex-1 rounded-lg bg-red-500/15 border border-red-400/40 text-red-200 px-3 py-2 text-sm hover:bg-red-500/25"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 col-span-2 text-center py-8">
                No bills waiting for review.
              </p>
            )}
          </div>
        </div>

        {renderHistoryList(reimbursements, "Decision History")}
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-3">
            Monthly Approval Volume
          </h3>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-2">
              This Month
            </p>
            <p className="text-3xl font-semibold">
              {user.role === "Manager"
                ? countByStatus("ManagerApproved")
                : countByStatus("DirectorApproved")}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {user.role} approvals processed
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-3">Focused Claim</h3>
          {selected ? (
            <>
              <p className="font-medium mb-1">{selected.title}</p>
              <p className="text-sm text-gray-400 mb-4">
                {selected.employee?.fullName || "Unknown"}
              </p>
              <StatusTimeline status={selected.status} />
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Select a claim from history.
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const renderAccountant = () => (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Awaiting Payment</h3>
            <span className="text-xs uppercase tracking-[0.14em] text-gray-500">
              {queue.length} ready
            </span>
          </div>

          <div className="space-y-3">
            {queue.length > 0 ? (
              queue.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {item.employee?.fullName || "Unknown"} • {item.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">
                      {item.currency} {item.amount}
                    </p>
                    <button
                      onClick={() =>
                        handleReview(item._id, "Paid", {
                          paymentReference: `PAY-${item._id.slice(-6).toUpperCase()}`,
                        })
                      }
                      className="rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 px-4 py-2 text-sm hover:bg-amber-500/30"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No bills are waiting for payment.
              </p>
            )}
          </div>
        </div>

        {renderHistoryList(reimbursements, "Disbursement Ledger")}
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Finance Metrics</h3>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-2">
                Total Reimbursed This Month
              </p>
              <p className="text-2xl font-semibold">
                {money(paidThisMonthTotal)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-2">
                Pending Disbursement Total
              </p>
              <p className="text-2xl font-semibold">
                {money(pendingDisbursementTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-3">Latest Paid</h3>
          <div className="space-y-2">
            {reimbursements
              .filter((item) => item.status === "Paid")
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item._id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm"
                >
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.currency} {item.amount}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderAdmin = () => {
    const managedUsers = adminUsers.filter((item) => item.role !== "Admin");
    const previewEvents = activityFeed.slice(0, 4);

    return (
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">
                {managedUsers.length} registered users
              </span>
            </div>

            <div className="space-y-3">
              {managedUsers.length > 0 ? (
                managedUsers.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold">{item.fullName}</p>
                      <p className="text-xs text-gray-400">
                        {item.email} • {item.role} • {item.department || "N/A"} •{" "}
                        {item.employeeId}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-lg border text-xs ${
                        item.active
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">
                  No users found.
                </p>
              )}
            </div>
          </div>

          {renderHistoryList(reimbursements, "System Claim Stream")}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">System Activity Feed</h3>
            <div className="space-y-3">
              {previewEvents.length > 0 ? (
                previewEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <p className="text-sm font-medium">{event.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{event.meta}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No activity detected yet.
                </p>
              )}

              {activityFeed.length > 4 && (
                <div className="pt-2 text-center">
                  <Link
                    to={`/${user.role.toLowerCase()}/notifications`}
                    className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.12em] text-gray-300 hover:bg-white/10"
                  >
                    Show More
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-3">User Distribution</h3>
            <div className="space-y-2">
              {["Admin", "Employee", "Manager", "Director", "Accountant"].map(
                (role) => (
                  <div
                    key={role}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3 flex items-center justify-between"
                  >
                    <span className="text-sm">{role}</span>
                    <strong>
                      {adminUsers.filter((item) => item.role === role).length}
                    </strong>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <AppShell
      title={config.title}
      subtitle={subtitle}
      navItems={navItems}
      notificationCount={notificationCount}
      accent={config.accent}
    >
      {notice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
          {notice}
        </div>
      )}

      {renderStatCards()}

      {user.role === "Employee" && renderEmployee()}
      {(user.role === "Manager" || user.role === "Director") &&
        renderApprovalQueue()}
      {user.role === "Accountant" && renderAccountant()}
      {user.role === "Admin" && renderAdmin()}

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setRejectTarget(null)}
          />
          <div className="relative w-full max-w-lg glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reject Claim</h3>
              <button
                onClick={() => setRejectTarget(null)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Add rejection comments for {rejectTarget.title}.
            </p>
            <textarea
              value={rejectComment}
              onChange={(event) => setRejectComment(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-red-300/60"
              placeholder="State why this claim is rejected..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={submittingReject}
                className="px-4 py-2 rounded-lg border border-red-300/40 bg-red-500/20 text-red-100 text-sm hover:bg-red-500/30 disabled:opacity-60"
              >
                {submittingReject ? "Rejecting..." : "Reject with Comment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptPreviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setReceiptPreviewTarget(null)}
          />
          <div className="relative w-full max-w-4xl glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Receipt Preview</h3>
                <p className="text-xs text-gray-400">
                  {receiptPreviewTarget.title} •{" "}
                  {receiptPreviewTarget.receipt?.fileName}
                </p>
              </div>
              <button
                onClick={() => setReceiptPreviewTarget(null)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {receiptPreviewTarget.receipt?.mimeType?.includes("pdf") ? (
              <iframe
                src={receiptPreviewTarget.receipt.url}
                title="Receipt PDF Preview"
                className="w-full h-[70vh] rounded-xl border border-white/10 bg-black"
              />
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/40 p-2">
                <img
                  src={receiptPreviewTarget.receipt?.url}
                  alt={receiptPreviewTarget.receipt?.fileName || "Receipt"}
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default DashboardPage;
