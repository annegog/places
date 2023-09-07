// import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ImageProfile from "../ImageProfile";

export default function RegisterPage() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState(false);
  const [tenant, setTenant] = useState(false);
  const [profilephoto, setProfilePhoto] = useState([]);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [atLeastOneChecked, setAtLeastOneChecked] = useState(true);

  const [redirect, setRedirect] = useState(false);
  const flagPhoto = false;

  function uploadPhoto(ev) {
    ev.preventDefault();
    try {
      const files = ev.target.files;
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append("profilephoto", files[i]);
      }
      axios
        .post("/upload-profilePhoto", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const { data: filenames } = response;
          setProfilePhoto((prev) => {
            return [...prev, ...filenames];
          });
          console.log("Image uploaded from your device:", files);
        });
    } catch (error) {
      console.error("Error uploading the photo from your device:", error);
    }
  }
 
  function removePhoto(filename){
    setProfilePhoto([...profilephoto.filter(profilephoto => profilephoto !== filename)]);
  }
  
  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post("/register", {
        first_name,
        last_name,
        username,
        phone,
        profilephoto,
        email,
        password,
        host,
        tenant,
      });
      alert("Submission successful!");
      //redirect as logged in-else to login!!!!!!!!
      setRedirect(true);
    } catch (e) {
      // alert('Submission FAILED! Try again.');
      if (e.response) {
        if (e.response.status === 422) {
          const errorCode = e.response.data?.code; // Use optional chaining to handle undefined data.code
          if (errorCode === 11000) {
            const keyPattern = e.response.data?.keyPattern;
            const keyValue = e.response.data?.keyValue;
            if (keyPattern.username === 1) {
              alert(
                `Username "${keyValue.username}" ALREADY been used! Please try a different one.`
              );
            } else if (keyPattern.email === 1) {
              alert(
                `Email "${keyValue.email}" ALREADY been used! Please try a different one.`
              );
            } else {
              alert("Submission FAILED: Unknown error.");
            }
          } else {
            alert("Submission FAILED: Unknown error.");
          }
        } else {
          alert("Submission FAILED: " + e.response.statusText);
        }
      } else {
        alert("Submission FAILED: " + e.message);
      }
    }
  }

  const handleOptionChange = (ev) => {
    const optionValue = ev.target.value;
    const isChecked = ev.target.checked;

    // Update the corresponding state variable based on the option
    switch (optionValue) {
      case "host":
        setHost(isChecked);
        if (isChecked) {
          setAtLeastOneChecked(true);
        }
        break;
      case "tenant":
        setTenant(isChecked);
        if (isChecked) {
          setAtLeastOneChecked(true);
        }
        break;
      default:
        break;
    }
  };

  //for password
  const handlePasswordChange = (ev) => {
    const newPassword = ev.target.value;
    setPassword(newPassword);

    // Check if passwords match immediately as the user types
    setPasswordsMatch(
      newPassword === confirmPassword || confirmPassword === ""
    );
  };

  const handleConfirmPasswordChange = (ev) => {
    const newConfirmPassword = ev.target.value;
    setConfirmPassword(newConfirmPassword);

    // Check if passwords match immediately as the user types
    setPasswordsMatch(password === newConfirmPassword);
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled = !passwordsMatch;

  // Submit
  const handleSubmit = (ev) => {
    if (!host && !tenant) {
      ev.preventDefault();
      setAtLeastOneChecked(false);
    }
    // if (!passwordsMatch) {
    //   ev.preventDefault();
    // }
  };

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mt-34">
        <h1 className="text-4xl text-center mt-6">Create an account</h1>
        <p className="text-xs text-center text-gray-900">
          All fields are required!
        </p>
        <form onSubmit={registerUser}>
          <div className="grid gap-4 mb-2 md:grid-cols-2 mt-6">
            <div className="grid grid-cols-1">
              <div>
                <label
                  for="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="John"
                  value={first_name}
                  onChange={(ev) => setFirstName(ev.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  for="last_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Doe"
                  value={last_name}
                  onChange={(ev) => setLastName(ev.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                for="photo"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Profile Photo
              </label>

              {profilephoto && profilephoto.length > 0 ? 
                profilephoto.map((filename) => (
                    <div
                      className="h-32 flex relative cursor-pointer"
                      key={filename}
                    >
                      <ImageProfile
                        className="rounded-3xl w-full object-cover aspect-square"
                        src={filename}
                        alt=""
                      />
                      <button onClick={() => removePhoto(filename)} className="cursor-pointer absolute buttom-2 right-2 text-gray-400 bg-black bg-opacity-50 rounded-lg p-1 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                  stroke="currentColor" className="w-6 h-6" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
                    </div>
                  ))
                : null}

              {profilephoto && profilephoto.length === 0 ? (
                <label className="cursor-pointer flex items-center justify-center border bg-transparent rounded-3xl p-10 text-sm text-gray-450">
                  <input
                    type="file"
                    className="hidden"
                    onChange={uploadPhoto}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                    />
                  </svg>
                </label>
              ) : null}
            </div>

            <div>
              <label
                for="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className=" bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="Username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                required
              />
            </div>

            <div>
              <label
                for="phone"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="Phone number"
                value={phone}
                onChange={(ev) => setPhoneNumber(ev.target.value)}
                pattern="[0-9]{10}"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              for="property"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Choose Property
            </label>

            <div className="flex w-full">
              <label className="cursor-pointer w-1/2 mr-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  value="host"
                  checked={host}
                  onChange={handleOptionChange}
                />
                {/* Host */}
                <span className="ml-2">Host</span>
              </label>
              <label className="cursor-pointer w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  value="tenant"
                  checked={tenant}
                  onChange={handleOptionChange}
                />
                {/* Tenant */}
                <span className="ml-2">Tenant</span>
              </label>
            </div>
            {!atLeastOneChecked && (
              <p className="mt-2 text-red-500 text-xs">Check at least one!</p>
            )}
          </div>

          <div className="mb-6">
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="you@mail.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              for="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="ex. a1b2c3!"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {!passwordsMatch && (
              <p className="text-red-500 text-xs">Passwords do not match!</p>
            )}
          </div>

          <div className="mb-6">
            <label
              for="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="your password again!"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            ></input>
            {!passwordsMatch && (
              <p className="text-red-500 text-xs">Passwords do not match!</p>
            )}
          </div>

          {/* <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
              />
            </div>
            <label
              for="remember"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
            </label>
          </div> */}

          <button
            type="submit"
            disabled={!passwordsMatch}
            onClick={handleSubmit}
            className="primary hover:bg-blue-900 focus:ring-2 focus:outline-none"
          >
            Submit
          </button>
          <div className="text-center py-2 text-gray-700 mb-6">
            Already a member?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
