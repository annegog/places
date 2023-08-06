import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const {setUser} = useContext(UserContext);

  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post("/login", {
        username, //email,
        password,
      });
      setUser(data);
      // alert("Login successful");
      setRedirect(true);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 422) {
          alert("Your password is WRONG! Try again.");
        } else if (e.response.status === 404) {
          alert("Your username is WRONG! Try again.");
        } else {
          alert("Login FAILED! Try again.");
        }
      } else {
        alert("Login FAILED: " + e.message);
      }
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mt-34">
        <h1 className="text-4xl text-center mt-6">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <label for="email" className="text-sm font-medium text-gray-900">
            Username
          </label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={ev => setUsername(ev.target.value)}
            required
          />
          <label for="password" className="text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
            required
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
