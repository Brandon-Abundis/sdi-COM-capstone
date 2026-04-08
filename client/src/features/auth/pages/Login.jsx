import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../app/AuthProvider";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card bg-base-200 card-border border-accent w-full max-w-lg">
        <div className="card-body">
          <h2 className="card-title text-primary text-2xl pb-3">Login</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="input input-bordered w-full"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input input-bordered w-full"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary bg-primary hover:border-secondary"
              >
                Login
              </button>
            </div>
          </form>
          <p className="text-center pt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="link text-amber-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
