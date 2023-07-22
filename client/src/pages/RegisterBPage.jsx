import { useContext } from "react";
import { Link } from "react-router-dom";
import { Select } from "react-dropdown-select";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [property, setProperty] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function registerUser() {
    axios.post("/register", {
      first_name,
      last_name,
      username,
      phone,
      property,
      email,
      password,
    });
  }

  const propertyOptions = [
    { value: "administrator", label: "Administator" },
    { value: "host", label: "Host" },
    { value: "tenant", label: "Tenant" },
    { value: "anonymous", label: "Anonymous" },
  ];

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mt-34">
        <h1 className="text-4xl text-center mt-6">Create an account</h1>
        <form>
          <div class="grid gap-4 mb-6 md:grid-cols-2 mt-6">
            <div>
              <label
                for="first_name"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="John" value={first_name} onChange={ev => setFirstName(ev.target.value)}
                required
              />
            </div>
            <div>
              <label
                for="last_name"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="Doe" value={last_name} onChange={ev => setLastName(ev.target.value)}
                required
              />
            </div>
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="username" value={username} onChange={ev => setUsername(ev.target.value)}
                required
              />
            </div>
            <div>
              <label
                for="property"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Choose Property
              </label>
              <Select
                options={propertyOptions}
                placeholder="Choose" 
                type="select" value={property} 
                // onChange={ev => setProperty(ev.target.value)}
                // multi
                required
              />
            </div>
            <div>
              <label
                for="phone"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="Phone Number" value={phone} onChange={ev => setPhoneNumber(ev.target.value)}
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
          </div>
          <div class="mb-6">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="you@mail.com" value={email} onChange={ev => setEmail(ev.target.value)}
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="•••••••••" value={password} onChange={ev => setPassword(ev.target.value)}
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="confirm_password"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
            //   ELEGXOS TOY PASSWORD
              required
            ></input>
          </div>
          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
              />
            </div>
            <label
              for="remember"
              class="ml-2 text-sm font-medium text-gray-700"
            >
              I agree with the{" "}
              <a
                href="#"
                class="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="primary hover:bg-blue-900 focus:ring-2 focus:outline-none"
          >
            Submit
          </button>
          <div className="text-center py-2 text-gray-700 mb-6">
            Already a member?{" "}
            <Link className="underline text-gray-700" to={"/login"}>
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
