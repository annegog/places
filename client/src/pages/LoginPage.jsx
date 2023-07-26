import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      await axios.post("/login", {
        email,
        password,
      });
      alert("Login successful");
    } catch (e) {
      alert("Login failed");
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mt-34">
        <h1 className="text-4xl text-center mt-6">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <label for="email" className="text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <label for="password" className="text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to={"/registerB"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
