import AccountNav from "../AccounNav";
import { useContext, useEffect, useState } from "react"; // Import useContext
import { UserContext } from "../UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image";

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
      Myyyyyyy Bookings are here
      <div>
        {bookings?.length > 0 && bookings.map(booking => (
            <Link to={`/account/bookings/${booking._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-2">
            
                        <div className="py-3 pr-3 grow">
              <h2 className="text-xl">{booking.place.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
