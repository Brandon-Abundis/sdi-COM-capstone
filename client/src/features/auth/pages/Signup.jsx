import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../app/AuthProvider";
import { useState } from "react";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const fakeUser = {
      id: 1,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    };

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(fakeUser);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0d17] flex items-center justify-center p-6">
      <div className="card card-border border-amber-400 bg-base-100 w-full max-w-lg shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-[#7c3aed] text-2xl pb-3">Signup</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="input input-bordered w-full"
              name="firstName"
              type="text"
              required
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="input input-bordered w-full"
              name="lastName"
              type="text"
              required
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
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
            <input
              className="input input-bordered w-full"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary bg-[#7c3aed] hover:border-[#a78bfa]"
              >
                Create Account
              </button>
            </div>
          </form>
          <p className="text-center pt-3">
            Already have an account?{" "}
            <Link to="/login" className="link text-amber-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
