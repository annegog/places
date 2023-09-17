import { useContext, useState, useEffect } from "react";
import moment from "moment";
import { UserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookingWindow({ place }) {
  const { user, setUser } = useContext(UserContext);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [diffInDays, setDiffInDays] = useState(1);
  const [totalCost, setTotalCost] = useState(diffInDays*place.price);
  
  ///////

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  if (user && !first_name && !last_name && !phone && !email) {
    console.log("User:", user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone);
    setEmail(user.email);
  }

  // Open - close dialog //
  const [open, setOpen] = useState(false);
  const handleClickToOpen = () => {
    if (!checkIn || !checkOut || numGuests < 1) {
      setOpen(false);
    }
    setOpen(true);
  };

  const handleToClose = () => {
    setOpen(false);
  };

  // calucator and check in the check in and ck=heck out dates //
  const calculate = () => {
    if (!checkIn || !checkOut) {
      setDiffInDays(1); // Reset the result
      return;
    }

    const arrival = moment(checkIn);
    const departure = moment(checkOut);
    const today = moment();

    if (arrival.isBefore(today) && !arrival.isSame(today)) {
      setCheckIn("");
      setDiffInDays(1); // Reset - check-out before check-in
      return;
    }

    if (arrival.isAfter(departure)) {
      setCheckOut("");
      setDiffInDays(1); // Reset - check-out before check-in
      return;
    }

    const diffInDays = departure.diff(arrival, "days");

    if (diffInDays < 1) {
      setCheckIn("");
      setCheckOut("");
      setDiffInDays(null);
      return;
    }
    setDiffInDays(diffInDays);
  };

  // // redirections to loin and sing in pages //
  // const [redirectLogin, setRedirectLogin] = useState(false);
  // const [redirectRegister, setRedirectRegister] = useState(false);
  // if (redirectLogin) {
  //   return <Navigate to={"/login"} />;
  // }
  // if (redirectRegister) {
  //   return <Navigate to={"/register"} />;
  // }

  async function bookIt(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post("/booking", {
        place: place._id, checkIn, checkOut, 
        numGuests, stayDays:diffInDays, 
        first_name, last_name, phone, email, price:totalCost,
      });
      const bookedId = response.data._id;
      // redirect?
      navigate("/account/bookings");
    } catch (error) {
      console.error("Error on booking:", error);
    }
  }

  return (
    <>
      <div className="bg-white shadow-2xl rounded-2xl p-2">
        <div className="text-lg font-semibold text-b text-left ml-6 mb-2 ">
          €{place.price} night
        </div>

        <div className="border rounded-2xl mt-2 mb-2">
          <div className="flex">
            <div className=" py-3 px-2 border-r">
              <label>Check in: </label>
              <input
                type="date"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
                onBlur={calculate}
              />
            </div>
            <div className="py-3 px-2">
              <label>Check out: </label>
              <input
                type="date"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
                onBlur={calculate}
              />
            </div>
          </div>
          <div className=" py-3 px-2 border-t ">
            <label>Guests: </label>
            <input
              type="number"
              value={numGuests}
              onChange={(ev) => setNumGuests(ev.target.value)}
            />
          </div>
        </div>
        <div>
          <button className="primary" onClick={handleClickToOpen}>
            Reserve
          </button>
          {!open && (
            <p className="mt-2 text-red-500 text-xs">
              Check-in, check-out dates, and number of guests are required.
            </p>
          )}
        </div>

        {open && (
          <div>
            <dialog
              style={{
                width: "50%",
                maxWidth: "600px",
                maxHeight: "900px",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                zIndex: 1000,
                overflow: "auto",
              }}
              className=" rounded-2xl bg-center"
              open={open}
              onClose={handleToClose}
            >
              <button onClick={handleToClose} className="bg-transparent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="mt-2 text-2xl font-semibold text-center">
                Complete the reservation
              </h2>
              {!user && (
                <div>
                  <div className="text-center py-2 text-gray-700">
                    You need to have an account. Already a member?{" "}
                    <Link className="underline text-black" to={"/login"}>
                      Login now
                    </Link>
                    . Or make a{" "}
                    <Link className="underline text-black" to={"/register"}>
                      New account
                    </Link>{" "}
                    now.
                  </div>
                </div>
              )}
              {user && (
              <div className="mt-2 mb-8">
                <dialogContent>
                  <div className="border rounded-2xl mt-2 mb-2">
                    <div className="grid grid-cols-3">
                      <div className=" py-3 px-2 border-r">
                        <label>Check in: </label>
                        <input type="date" value={checkIn} readOnly />
                      </div>
                      <div className="py-3 px-2  border-r">
                        <label>Check out: </label>
                        <input type="date" value={checkOut} readOnly />
                      </div>
                      <div className=" py-3 px-2 border-t text-center">
                        <text type="number">Guests: {numGuests}</text>
                      </div>
                    </div>
                    <div>
                      <div className=" py-3 px-2 border-t ">
                        <label>First Name: </label>
                        <input
                          type="text"
                          value={first_name}
                          onChange={(ev) => setFirstName(ev.target.value)}
                          required
                        />
                      </div>
                      <div className=" py-3 px-2 border-t ">
                        <label>Last Name: </label>
                        <input
                          type="text"
                          value={last_name}
                          onChange={(ev) => setLastName(ev.target.value)}
                          required
                        />
                      </div>
                      <div className=" py-3 px-2 border-t ">
                        <label>Phone number:</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(ev) => setPhone(ev.target.value)}
                          pattern="[0-9]{10}"
                          required
                        />
                      </div>
                      <div className=" py-3 px-2 border-t ">
                        <label>Email address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(ev) => setEmail(ev.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <hr className="mt-1 mb-2" />
                    <div className="ml-4 grid grid-cols-2 mb-4">
                      <div className="text-left">
                        <text className="font-semibold text-lg text-center">
                          Total
                        </text>
                      </div>
                      <div className="text-center">
                        <text className="font-medium text-lg text-center">
                          € {place.price * diffInDays}
                        </text>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit" onClick={bookIt}
                    className="primary hover:bg-blue-900 focus:ring-2 focus:outline-none mt-2"
                  >
                    Book it now
                  </button>
                </dialogContent>
              </div>
            )}
            </dialog>
          </div>
        )}

        <div className="mt-6 ml-4 grid grid-cols-2">
          <div className="text-left">
            <text className="underline">
              {" "}
              € {place.price} x {diffInDays} days
            </text>
          </div>
          <div className="text-center">
            <text>€ {place.price * diffInDays}</text>
          </div>
        </div>
        <hr className="mt-4 mb-2" />
        <div className="ml-4 grid grid-cols-2">
          <div className="text-left">
            <text className="font-semibold text-lg text-center">Total</text>
          </div>
          <div className="text-center">
            <text className="font-medium text-lg text-center" onChange={()=>setTotalCost(plsce.price*diffInDays)}>
              € {place.price * diffInDays}
            </text>
          </div>
        </div>
      </div>
    </>
  );
}
