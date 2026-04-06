import { useNavigate } from "react-router-dom";
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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {error && <div className="text-red-700 px-4 py-3">{error}</div>}
        <input
          className="input"
          name="firstName"
          type="firstName"
          required
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="input"
          name="lastName"
          type="lastName"
          required
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="input"
          name="email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          name="password"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="input"
          name="confirmPassword"
          type="password"
          required
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="cursor-pointer">
          Create Account
        </button>
      </form>
    </div>
  );
}
