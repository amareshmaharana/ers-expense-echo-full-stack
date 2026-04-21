import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Shield,
  Sparkles,
  UserCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getValidationState = (value, isValid) => {
  if (!value) return "neutral";
  return isValid ? "valid" : "invalid";
};

const roleOptions = [
  { name: "Employee", icon: UserCircle2 },
  { name: "Manager", icon: Briefcase },
  { name: "Director", icon: CheckCircle2 },
  { name: "Accountant", icon: CreditCard },
  { name: "Admin", icon: Shield },
];

const loginRoleOptions = [
  { name: "Auto Detect", icon: Sparkles },
  ...roleOptions,
];

const departments = [
  "Engineering",
  "Finance",
  "Operations",
  "Human Resources",
  "Sales",
  "Marketing",
];
const genders = ["Male", "Female", "Non-Binary", "Prefer not to say"];
const authorityLevels = ["L1", "L2", "L3", "Executive"];
const securityQuestions = [
  "What is your first school name?",
  "What was your childhood nickname?",
  "What is your favorite book?",
  "What city were you born in?",
];

const bentoItems = [
  {
    title: "Workflow Automation",
    text: "Submission -> Manager -> Director -> Accountant happens in a clean, trackable sequence.",
    tone: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    title: "Audit-Ready Trails",
    text: "Each decision carries role metadata and timestamps for compliance visibility.",
    tone: "from-purple-500/20 to-purple-500/5",
  },
  {
    title: "Role Precision",
    text: "Every dashboard is tailored to exactly what that role should see and action.",
    tone: "from-emerald-500/20 to-emerald-500/5",
  },
];

const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  error = "",
  autoComplete = "off",
  validationState = "neutral",
}) => (
  <div className="relative">
    {(() => {
      const effectiveState = error ? "invalid" : validationState;
      const stateClasses =
        effectiveState === "valid"
          ? "border-emerald-400/70 bg-emerald-500/[0.08] focus:border-emerald-300"
          : effectiveState === "invalid"
            ? "border-red-400/70 bg-red-500/[0.08] focus:border-red-400"
            : "border-white/15 bg-white/[0.03] focus:border-cyan-400/70";

      return (
        <>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder=" "
      className={`peer w-full rounded-xl border px-4 pr-12 pt-6 pb-2 text-sm text-white outline-none transition ${stateClasses}`}
    />
    <label
      htmlFor={id}
      className="pointer-events-none absolute left-4 top-2 text-[11px] uppercase tracking-[0.14em] text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:tracking-[0.14em]"
    >
      {label}
    </label>
    {effectiveState !== "neutral" && (
      <span
        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 ${
          effectiveState === "valid"
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-red-500/20 text-red-300"
        }`}
      >
        {effectiveState === "valid" ? (
          <CheckCircle2 size={16} />
        ) : (
          <XCircle size={16} />
        )}
      </span>
    )}
        </>
      );
    })()}
    {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
  </div>
);

const StyledDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const normalized = options.map((item) =>
    typeof item === "string" ? { name: item } : item,
  );
  const selected =
    normalized.find((item) => item.name === value) || normalized[0];
  const SelectedIcon = selected.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-left text-sm text-white transition hover:border-white/30"
      >
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {SelectedIcon ? (
              <SelectedIcon size={15} className="text-cyan-300" />
            ) : (
              <span className="w-[15px]" />
            )}
            {selected.name}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-white/15 bg-[#0f0f10]/95 p-2 backdrop-blur-xl">
          {normalized.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onChange(item.name);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  value === item.name
                    ? "bg-cyan-500/15 text-cyan-200"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                {Icon ? <Icon size={15} /> : <span className="w-[15px]" />}
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AuthPage = ({ mode = "login" }) => {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [role, setRole] = useState("Employee");
  const [loginRole, setLoginRole] = useState("Auto Detect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [contactNumber, setContactNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(
    securityQuestions[0],
  );
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [authorityLevel, setAuthorityLevel] = useState(authorityLevels[0]);
  const [accessKey, setAccessKey] = useState("");
  const [registerStep, setRegisterStep] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const isEmployeeRegistration = isRegister && role === "Employee";
  const showPasswordMatchHint =
    isRegister && (password.length > 0 || confirmPassword.length > 0);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const emailValidation = getValidationState(
    email.trim(),
    emailPattern.test(email.trim()),
  );
  const confirmPasswordValidation = getValidationState(
    confirmPassword,
    confirmPassword === password && password.length > 0,
  );
  const fullNameValidation = getValidationState(
    fullName.trim(),
    fullName.trim().length >= 2,
  );
  const employeeIdValidation = getValidationState(
    employeeId.trim(),
    employeeId.trim().length >= 2,
  );
  const dobValidation = getValidationState(dob, Boolean(dob));
  const contactNumberValidation = getValidationState(
    contactNumber.trim(),
    contactNumber.trim().length >= 7,
  );
  const designationValidation = getValidationState(
    designation.trim(),
    designation.trim().length >= 2,
  );
  const securityAnswerValidation = getValidationState(
    securityAnswer.trim(),
    securityAnswer.trim().length >= 2,
  );

  useEffect(() => {
    if (!isRegister || role !== "Employee") {
      setRegisterStep(1);
    }
  }, [isRegister, role]);

  const roleSecurityHint = useMemo(() => {
    if (!isRegister)
      return loginRole === "Auto Detect"
        ? "Role is detected automatically from credentials."
        : `Secure ${loginRole} portal access only.`;
    if (role === "Employee")
      return "Employee onboarding includes identity and security recovery fields.";
    if (["Manager", "Director"].includes(role))
      return "Authority profile fields are required for this registration.";
    return "Operational role registration requires a valid access key.";
  }, [isRegister, role, loginRole]);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) nextErrors.email = "Email is required";
    if (!password.trim()) nextErrors.password = "Password is required";

    if (isRegister) {
      if (!fullName.trim()) nextErrors.fullName = "Full name is required";
      if (!employeeId.trim()) nextErrors.employeeId = "Employee ID is required";
      if (!confirmPassword.trim())
        nextErrors.confirmPassword = "Confirm password is required";
      if (password !== confirmPassword)
        nextErrors.confirmPassword = "Passwords do not match";

      if (role === "Employee") {
        if (!dob) nextErrors.dob = "Date of birth is required";
        if (!gender) nextErrors.gender = "Gender is required";
        if (!contactNumber.trim())
          nextErrors.contactNumber = "Contact number is required";
        if (!designation.trim())
          nextErrors.designation = "Designation is required";
        if (!department.trim())
          nextErrors.department = "Department is required";
        if (!securityQuestion.trim())
          nextErrors.securityQuestion = "Security question is required";
        if (!securityAnswer.trim())
          nextErrors.securityAnswer = "Security answer is required";
      }

      if (role === "Manager" || role === "Director") {
        if (!designation.trim())
          nextErrors.designation = "Designation is required";
        if (!department.trim())
          nextErrors.department = "Department is required";
        if (!authorityLevel.trim())
          nextErrors.authorityLevel = "Level of authority is required";
      }

      if (role === "Admin" || role === "Accountant") {
        if (accessKey.length > 120)
          nextErrors.accessKey = "Access key is too long";
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const canMoveNext = () => {
    if (!isEmployeeRegistration) return true;
    if (registerStep === 1) {
      return (
        fullName.trim() &&
        employeeId.trim() &&
        email.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        password === confirmPassword
      );
    }
    if (registerStep === 2) {
      return dob && gender && contactNumber.trim() && designation.trim() && department.trim();
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isRegister) {
        const result = await register({
          fullName,
          employeeId,
          empTypeId: designation || role,
          email,
          password,
          role,
          department:
            role === "Admin" || role === "Accountant" ? "" : department,
          dob,
          gender,
          contactNumber,
          designation,
          securityQuestion,
          securityQuestionId:
            role === "Employee"
              ? String(securityQuestions.indexOf(securityQuestion) + 1)
              : null,
          securityAnswer,
          authorityLevel,
          accessKey,
        });
        navigate(`/${result.role.toLowerCase()}/dashboard`);
        return;
      }

      const loggedInUser = await login(email, password, loginRole);
      navigate(`/${loggedInUser.role.toLowerCase()}/dashboard`);
    } catch (submissionError) {
      const serverMessage = submissionError.response?.data?.message;
      setError(
        serverMessage ||
          submissionError.message ||
          (isRegister ? "Unable to register" : "Unable to sign in"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(168,85,247,0.16),transparent_42%),radial-gradient(circle_at_92%_8%,rgba(6,182,212,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />

      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-glass">
        <nav className="mx-auto grid w-full max-w-7xl grid-cols-3 items-center px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 text-sm font-bold">EE</span>
            <span className="hidden text-sm font-semibold sm:inline">ExpenseEcho</span>
          </Link>

          <p className="text-center text-xs uppercase tracking-[0.2em] text-gray-300">
            AUTHENTICATE YOURSELF
          </p>

          <div className="justify-self-end" />
        </nav>
      </header>

      <div className="relative grid min-h-screen lg:grid-cols-[1.2fr_0.8fr]">
        <section className="hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.16em] text-gray-300">
              <Sparkles size={13} className="text-cyan-300" />
              ExpenseEcho Workspace
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight">
              Auth built for disciplined reimbursement operations.
            </h1>
            <p className="mt-5 max-w-lg text-gray-400">
              High-trust role access with audit-grade controls and a modern
              workflow surface.
            </p>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                  Pipeline
                </p>
                <p className="mt-3 text-sm text-gray-200">
                  Submission {"->"} Manager {"->"} Director {"->"} Disbursement
                </p>
              </div>
              {bentoItems.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5 transition hover:border-white/20`}
                >
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            ExpenseEcho 2026. Editorial Minimalism + secure role-based access.
          </p>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.12em] text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

            <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Role Auth
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {isRegister ? "Create Account" : "Secure Login"}
                </h2>
              </div>
              <Link
                to={isRegister ? "/login" : "/register"}
                className="rounded-lg border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.12em] text-gray-300 transition hover:border-white/30 hover:text-white"
              >
                {isRegister ? "Login" : "Register"}
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                  Role Access
                </p>
                <StyledDropdown
                  value={isRegister ? role : loginRole}
                  onChange={isRegister ? setRole : setLoginRole}
                  options={isRegister ? roleOptions : loginRoleOptions}
                />
                {fieldErrors.role && (
                  <p className="mt-1 text-xs text-red-300">
                    {fieldErrors.role}
                  </p>
                )}
                {roleSecurityHint && (
                  <p className="mt-1 text-xs text-gray-500">
                    {roleSecurityHint}
                  </p>
                )}
              </div>

              {isEmployeeRegistration && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-2">Registration Progress</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className={`h-1.5 flex-1 rounded-full ${registerStep >= step ? 'bg-cyan-400' : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {registerStep === 1 && 'Step 1: Basic Info'}
                    {registerStep === 2 && 'Step 2: Personal Details'}
                    {registerStep === 3 && 'Step 3: Security Setup'}
                  </p>
                </div>
              )}

              {isRegister && (
                <>
                  {(!isEmployeeRegistration || registerStep === 1) && (
                    <>
                      <FloatingInput
                        id="fullName"
                        label="Full Name"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        error={fieldErrors.fullName}
                        validationState={fullNameValidation}
                        autoComplete="name"
                      />

                      <FloatingInput
                        id="employeeId"
                        label={
                          role === "Manager" || role === "Director"
                            ? "Manager / Director ID"
                            : "Employee ID"
                        }
                        value={employeeId}
                        onChange={(event) => setEmployeeId(event.target.value)}
                        error={fieldErrors.employeeId}
                        validationState={employeeIdValidation}
                      />

                      <FloatingInput
                        id="email"
                        label={
                          role === "Admin"
                            ? "Admin Email"
                            : role === "Accountant"
                              ? "Staff Email"
                              : "Work Email"
                        }
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        error={fieldErrors.email}
                        validationState={emailValidation}
                        autoComplete="email"
                      />

                      <FloatingInput
                        id="password"
                        label="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        error={fieldErrors.password}
                        autoComplete="new-password"
                      />

                      <FloatingInput
                        id="confirmPassword"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        type="password"
                        error={fieldErrors.confirmPassword}
                        validationState={confirmPasswordValidation}
                        autoComplete="new-password"
                      />

                      {showPasswordMatchHint && (
                        <p
                          className={`text-xs ${
                            passwordsMatch ? "text-emerald-300" : "text-red-300"
                          }`}
                        >
                          {passwordsMatch
                            ? "Password matched"
                            : "Password not match yet"}
                        </p>
                      )}
                    </>
                  )}

                  {(role === "Employee" ||
                    role === "Manager" ||
                    role === "Director") && (
                    <>
                      {role === "Employee" && registerStep === 2 && (
                        <>
                          <FloatingInput
                            id="dob"
                            label="Date of Birth"
                            value={dob}
                            onChange={(event) => setDob(event.target.value)}
                            type="date"
                            error={fieldErrors.dob}
                            validationState={dobValidation}
                          />

                          <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                              Gender
                            </p>
                            <StyledDropdown
                              value={gender}
                              onChange={setGender}
                              options={genders}
                            />
                            {fieldErrors.gender && (
                              <p className="mt-1 text-xs text-red-300">
                                {fieldErrors.gender}
                              </p>
                            )}
                          </div>

                          <FloatingInput
                            id="contactNumber"
                            label="Contact Number"
                            value={contactNumber}
                            onChange={(event) =>
                              setContactNumber(event.target.value)
                            }
                            error={fieldErrors.contactNumber}
                            validationState={contactNumberValidation}
                          />
                        </>
                      )}

                      {(!isEmployeeRegistration || registerStep === 2) && (
                        <>
                          <FloatingInput
                            id="designation"
                            label={
                              role === "Employee"
                                ? "Employee Type / Designation"
                                : "Designation"
                            }
                            value={designation}
                            onChange={(event) => setDesignation(event.target.value)}
                            error={fieldErrors.designation}
                            validationState={designationValidation}
                          />

                          <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                              Department
                            </p>
                            <StyledDropdown
                              value={department}
                              onChange={setDepartment}
                              options={departments}
                            />
                            {fieldErrors.department && (
                              <p className="mt-1 text-xs text-red-300">
                                {fieldErrors.department}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {(role === "Manager" || role === "Director") && (
                        <div>
                          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                            Level of Authority
                          </p>
                          <StyledDropdown
                            value={authorityLevel}
                            onChange={setAuthorityLevel}
                            options={authorityLevels}
                          />
                          {fieldErrors.authorityLevel && (
                            <p className="mt-1 text-xs text-red-300">
                              {fieldErrors.authorityLevel}
                            </p>
                          )}
                        </div>
                      )}

                      {role === "Employee" && registerStep === 3 && (
                        <>
                          <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                              Security Question
                            </p>
                            <StyledDropdown
                              value={securityQuestion}
                              onChange={setSecurityQuestion}
                              options={securityQuestions}
                            />
                            {fieldErrors.securityQuestion && (
                              <p className="mt-1 text-xs text-red-300">
                                {fieldErrors.securityQuestion}
                              </p>
                            )}
                          </div>

                          <FloatingInput
                            id="securityAnswer"
                            label="Security Answer"
                            value={securityAnswer}
                            onChange={(event) =>
                              setSecurityAnswer(event.target.value)
                            }
                            error={fieldErrors.securityAnswer}
                            validationState={securityAnswerValidation}
                          />
                        </>
                      )}
                    </>
                  )}

                  {(role === "Admin" || role === "Accountant") && (
                    <FloatingInput
                      id="accessKey"
                      label="Access Key (Optional)"
                      value={accessKey}
                      onChange={(event) => setAccessKey(event.target.value)}
                      type="password"
                      error={fieldErrors.accessKey}
                    />
                  )}
                </>
              )}

              {!isRegister && (
                <>
                  <FloatingInput
                    id="email"
                    label="Email Address / Username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    error={fieldErrors.email}
                    validationState={emailValidation}
                    autoComplete="email"
                  />

                  <FloatingInput
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    error={fieldErrors.password}
                    autoComplete="current-password"
                  />
                </>
              )}

              {error && (
                <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              {isEmployeeRegistration && registerStep < 3 ? (
                <div className="flex items-center gap-2">
                  {registerStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setRegisterStep((current) => Math.max(1, current - 1))}
                      className="w-1/3 rounded-xl border border-white/20 px-4 py-3 text-sm font-medium hover:bg-white/10"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setRegisterStep((current) => Math.min(3, current + 1))}
                    disabled={!canMoveNext()}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-medium transition hover:border-cyan-300/60 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Next Step
                    <ArrowRight size={15} className="text-cyan-300" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isEmployeeRegistration && registerStep === 3 && (
                    <button
                      type="button"
                      onClick={() => setRegisterStep(2)}
                      className="w-1/3 rounded-xl border border-white/20 px-4 py-3 text-sm font-medium hover:bg-white/10"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-medium transition hover:border-cyan-300/60 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting
                      ? isRegister
                        ? "Creating account..."
                        : "Signing in..."
                      : isRegister
                        ? "Create Account"
                        : "Sign In"}
                    {!submitting && (
                      <ArrowRight size={15} className="text-cyan-300" />
                    )}
                  </button>
                </div>
              )}
            </form>

            {isRegister && (
              <p className="mt-6 text-center text-xs text-gray-500">
                Registration fields adapt to the selected role profile.
              </p>
            )}

            <div className="mt-6 text-center text-xs text-gray-500">
              {isRegister ? (
                <span>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    Login
                  </Link>
                </span>
              ) : (
                <span>
                  Need an account?{" "}
                  <Link
                    to="/register"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    Register
                  </Link>
                </span>
              )}
            </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
