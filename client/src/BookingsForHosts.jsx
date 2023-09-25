import axios from "axios";
import { Link } from "react-router-dom";
import ImagePlace from "./ImagePlace";
import { format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";

export default function BookingsForHosts({}) {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  useEffect(() => {
    axios.get("/bookings-host").then((res) => {
      setBookings(res.data);
    });
  }, []);

  return (
    <>
      <div className="mt-4 grid gap-2 md:ml-10 md:mr-10 lg:ml-28 lg:mr-28">
        {places.length > 0 &&
          places.map((place) => (
            <div
              key={place._id}
              className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
            >
              <div className="flex w-32 h-32 bg-gray-300 shrink-0 rounded-lg">
                {place && <ImagePlace place={place} />}
              </div>
              <div className="grow shrink">
                <h2 className="text-xl">{place.title}</h2>
                {bookings?.length > 0 &&
                bookings.some((booking) => booking.place === place._id) ? (
                  bookings
                    .filter((booking) => booking.place === place._id)
                    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
                    .map((booking) => (
                      <Link
                        key={booking._id}
                        to={`/account/forbookings/${booking._id}`}
                        className="border mt-2 flex cursor-pointer gap-4 bg-slate-300 p-4 rounded-3xl"
                      >
                        <div className="grow-2 shrink">
                          <div>
                            <text className="underline">
                              {booking.first_name} {booking.last_name}
                            </text>{" "}
                            reserve this place.
                          </div>
                          <div>
                            <text className="font-semibold">Reservation Dates:</text>{" "}
                            {format(new Date(booking.checkIn), "MMM dd, yyyy")} -{" "}
                            {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                          </div>
                          <div className="info-container text-sm text-gray-800">
                            <text>{booking.stayNights} nights</text>
                            <text>{booking.numGuests} guests</text>
                            <text> extra guests</text>
                          </div>
                          <span className="text-2xl">
                            Total price: €{booking.price}
                          </span>
                        </div>
                      </Link>
                    ))
                ) : (
                  <div className="mt-6 text-center">
                    <div className="text-2xl text-slate-600 mb-4">
                      🙁 You have no reservations for this place yet.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
