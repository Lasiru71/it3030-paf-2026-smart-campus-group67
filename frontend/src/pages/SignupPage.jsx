// SignupPage — registration form with validation, roles, and API integration
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Logo from "../components/common/Logo";
import { signup } from "../services/authService";
import { ROUTES } from "../utils/constants";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validate all form fields
  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Create your account</h1>
          <p className="text-slate-500 text-center text-sm mb-8">
            Join CampusReserve and start booking resources today
          </p>

          {/* Success banner */}
          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 text-center">
              ✅ Account created! Redirecting you to login…
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              label="Full Name"
              placeholder="Hasindu Chanuka"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="you@university.edu"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            {/* Role selector */}
            <div className="flex flex-col gap-1">
              <label htmlFor="role" className="text-sm font-medium text-slate-700">
                I am a
              </label>
              <select
                id="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              >
                <option value="USER">Student</option>
                <option value="ADMIN">Staff / Admin</option>
              </select>
            </div>

            <Button type="submit" fullWidth loading={loading} className="mt-2">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-blue-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
