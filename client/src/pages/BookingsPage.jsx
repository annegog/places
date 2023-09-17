import AccountNav from "../AccounNav";
import { useContext, useEffect, useState } from "react"; // Import useContext
import { UserContext } from "../UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import ImagePlace from "../ImagePlace";
import { format } from "date-fns";

export default function BookingsPage() {
  const { user } = useContext(UserContext); // Access user data from UserContext

  const isHost = () => {
    return user && user.host;
  };

  const isTenant = () => {
    return user && user.tenant;
  };

  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="mt-4 grid gap-2 lg:ml-10 lg:mr-10">
        {bookings?.length > 0 &&
          bookings
            .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
            .map((booking) => (
              <Link
                key={booking._id}
                to={`/account/bookings/${booking._id}`}
                className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
              >
                <div className="flex w-32 h-32 bg-gray-300  shrink-0 rounded-lg">
                  {booking.place && <ImagePlace place={booking.place} />}
                </div>
                <div className="grow-2 shrink">
                  <h2 className="text-xl">{booking.place.title}</h2>
                  <div>
                    You reserve this place for a duration spanning from{" "}
                    {format(new Date(booking.checkIn), "MMMM dd, yyyy")} to{" "}
                    {format(new Date(booking.checkOut), "MMMM dd, yyyy")}
                    {"."}
                  </div>
                  <div className="info-container text-sm text-gray-800">
                    <text>
                      {booking.stayDays} days and {booking.stayDays - 1} nights
                    </text>
                    <text>{booking.nunGuests}</text>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <span className="text-2xl">
                      Total price: ${booking.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
