import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../app/AuthProvider";
import { useState } from "react";

const SF_RANKS = [
  "Spc1",
  "Spc2",
  "Spc3",
  "Spc4",
  "Sgt",
  "TSgt",
  "MSgt",
  "SMSgt",
  "CMSgt",
  "2nd Lt",
  "1st Lt",
  "Capt",
  "Maj",
  "LtCol",
  "Col",
  "General",
];

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [rank, setRank] = useState("Spc1");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const newUser = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      gender,
      rank,
      age: parseInt(age),
    };

    try {
      await signup(newUser);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card card-border border-accent bg-base-200 w-full max-w-lg">
        <div className="card-body">
          <h2 className="card-title text-primary text-2xl pb-3">Signup</h2>
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
            <select
              className="select select-bordered w-full"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value=""></option>
            </select>
            <input
              className="input input-bordered w-full"
              name="age"
              type="number"
              required
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <select
              className="select select-bordered w-full"
              name="rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            >
              {SF_RANKS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary bg-primary hover:border-secondary"
              >
                Create Account
              </button>
            </div>
          </form>
          <p className="text-center pt-3">
            Already have an account?{" "}
            <Link to="/login" className="link text-warning">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
