import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Logo from "../components/common/Logo";
import { GoogleLogin } from "@react-oauth/google";
import { signup, googleLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

const SignupPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
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
    
    // Password validation: Min 6 characters, uppercase, lowercase, and numeric
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!form.password) errs.password = "Password is required.";
    else if (!passwordRegex.test(form.password)) {
      errs.password = "Password must be at least 6 characters, and include uppercase, lowercase, and a number.";
    }
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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 flex flex-col lg:grid lg:grid-cols-2 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-sky-400/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[160px] opacity-20" />
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate(ROUTES.HOME)}
        className="absolute top-6 left-6 lg:top-10 lg:left-10 z-[60] flex items-center gap-2 text-white/60 hover:text-white transition-all font-bold group"
      >
        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="hidden sm:inline text-sm uppercase tracking-widest">Back to Home</span>
      </button>

      {/* Left Column: Branding Section */}
      <div className="relative z-10 hidden lg:flex flex-col justify-center px-12 xl:px-24 text-white">
        <div className="max-w-xl">
          <div className="mb-12">
            <Logo />
          </div>
          <h1 className="text-5xl xl:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
            Join the Future of <br />
            <span className="text-sky-300">Campus Management.</span>
          </h1>
          <p className="text-xl text-blue-100/80 mb-12 leading-relaxed">
            Create an account to join thousands of students and staff members
            in optimizing university resources today. It's fast, free, and smart.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-black text-sky-300 mb-1">15k+</p>
              <p className="text-blue-100/60 text-sm font-bold uppercase tracking-wider">Bookings</p>
            </div>
            <div>
              <p className="text-3xl font-black text-sky-300 mb-1">200+</p>
              <p className="text-blue-100/60 text-sm font-bold uppercase tracking-wider">Spaces</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-md py-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20 shadow-xl">
              <Logo />
            </div>
          </div>

          {/* Glass Card */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/40 p-8 md:p-10 mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create your account</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">
              Start your journey with <span className="text-blue-700 font-bold">CampusReserve</span>
            </p>

            {/* Banner logic */}
            {(success || serverError) && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                {success && (
                  <div className="bg-green-50/80 backdrop-blur border border-green-200 text-green-700 text-sm rounded-2xl px-5 py-4 text-center font-bold">
                    ✅ Account created! Redirecting you to login…
                  </div>
                )}
                {serverError && (
                  <div className="bg-red-50/80 backdrop-blur border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    {serverError}
                  </div>
                )}
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Min. 6"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm"
                  placeholder="Repeat"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
              </div>
              {/* Role selector */}
              <div className="flex flex-col gap-1">
                <label htmlFor="role" className="text-sm font-medium text-slate-700">
                  I am a
                </label>
                <div className="relative group">
                  <select
                    id="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="USER">Student</option>
                    <option value="STAFF">Staff</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                    <UserPlus className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button type="submit" fullWidth loading={loading} className="py-4 rounded-2xl shadow-xl shadow-blue-500/20 bg-blue-700 hover:bg-blue-800 text-lg font-bold transition-all active:scale-[0.98]">
                  Get Started
                </Button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative px-4 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                </div>

                <div className="flex justify-center transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-md">
                    <GoogleLogin
                      useOneTap
                      theme="outline"
                      size="large"
                      width="100%"
                      onSuccess={async (credentialResponse) => {
                        setLoading(true);
                        try {
                          const { data } = await googleLogin({ idToken: credentialResponse.credential });
                          loginUser(data);
                          navigate(ROUTES.HOME);
                        } catch {
                          setServerError("Google registration failed. Please try again.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      onError={() => {
                        setServerError("Google signup encountered an error.");
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100/50 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <Link to={ROUTES.LOGIN} className="text-blue-700 font-black hover:text-blue-900 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-blue-100/30 text-[10px] uppercase tracking-[0.2em] font-bold lg:text-left lg:ml-2">
            CampusReserve • Secured Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
