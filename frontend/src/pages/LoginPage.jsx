// LoginPage — controlled form with validation, loading state, and API integration
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ArrowLeft } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Logo from "../components/common/Logo";
import { GoogleLogin } from "@react-oauth/google";
import { login, googleLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validate form fields
  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
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
      const { data } = await login({ email: form.email, password: form.password });
      loginUser(data);       // persist auth data
      navigate(ROUTES.HOME);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
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
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[160px] opacity-40" />
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

      {/* Left Column: Branding & Description */}
      <div className="relative z-10 hidden lg:flex flex-col justify-center px-12 xl:px-24 text-white">
        <div className="max-w-xl">
          <div className="mb-12">
            <Logo />
          </div>
          <h1 className="text-5xl xl:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
            Manage Campus Life <br/>
            <span className="text-sky-300">Like Never Before.</span>
          </h1>
          <p className="text-xl text-blue-100/80 mb-12 leading-relaxed">
            One platform for all your university needs. Book spaces, track equipment, 
            and coordinate events with just a few clicks.
          </p>

          <div className="space-y-6">
            {[
              { title: "Smart Bookings", desc: "Reserve halls and labs in seconds." },
              { title: "Equipment Tracking", desc: "Never lose track of campus assets." },
              { title: "Real-time Support", desc: "Help is always one message away." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="h-6 w-6 rounded-full bg-sky-400/20 border border-sky-400 flex items-center justify-center shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-sky-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{feature.title}</h3>
                  <p className="text-blue-100/60 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-24">
        <div className="w-full max-w-md">
          {/* Mobile Logo only (Hidden on LG) */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20 shadow-xl">
              <Logo />
            </div>
          </div>

          {/* Glass Card */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/40 p-10 md:p-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-10 font-medium">
              Sign in to <span className="text-blue-700 font-bold">CampusReserve</span>
            </p>

            {serverError && (
              <div className="mb-6 bg-red-50/80 backdrop-blur border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-start gap-3">
                <span className="shrink-0 mt-0.5">⚠️</span>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              
              <div className="pt-2 space-y-4">
                <Button type="submit" fullWidth loading={loading} className="py-4 rounded-2xl shadow-xl shadow-blue-500/20 bg-blue-700 hover:bg-blue-800 text-lg font-bold transition-all hover:scale-[1.01]">
                  <LogIn className="h-5 w-5 mr-3" />
                  Sign In
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
                        try {
                          const { data } = await googleLogin({ idToken: credentialResponse.credential });
                          loginUser(data);
                          navigate(ROUTES.HOME);
                        } catch {
                          setServerError("Google authentication failed. Please try again.");
                        }
                      }}
                      onError={() => {
                        setServerError("Google login encountered an error.");
                      }}
                    />
                  </div>
                </div>
              </div>

            </form>

            <div className="mt-10 pt-8 border-t border-slate-100/50">
              <p className="text-center text-sm text-slate-500 font-medium">
                Don't have an account?{" "}
                <Link to={ROUTES.SIGNUP} className="text-blue-700 font-black hover:text-blue-900 hover:underline transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-blue-100/30 text-[10px] uppercase tracking-[0.2em] font-bold lg:text-left lg:ml-2">
            © 2026 CampusReserve • Secured Institutional Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
