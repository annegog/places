import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccounNav";

// import AddressLink from "../AddressLink";
// import PlaceGallery from "../PlaceGallery";
// import BookingDates from "../BookingDates";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import format from "date-fns/format";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  if (showMap) {
    return (
      <div className="absolute inset-4 bg-white min-h-screen mr-5 ml-5 xl:mr-30 xl:ml-30">
        <div className="p-8 grid gap-4 ">
          <div className="grid grid-cols-2">
            <button
              onClick={() => setShowMap(false)}
              className="flex py-2 px-4 rounded-2xl bg-transparent "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h2 className="text-2xl text-right text-black">
              Take a closer look on the Map
            </h2>
          </div>
        </div>
        <div className="relative">
          <MapContainer
            center={booking.place.pinPosition}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={booking.place.pinPosition} />
          </MapContainer>
        </div>
        <hr className="mt-6 mb-4 w-80" />
        <text className="text-gray-500 font-serif">
          This is not the exact location of the property, as we prioritize
          security. Please reach out to the host after making a reservation to
          obtain the precise location.
        </text>
        <hr className="mt-10" />
      </div>
    );
  }

  return (
    <div className="my-8">
      <AccountNav />
      <h1 className="text-3xl">Your reservation in: {booking.place.title}</h1>
      <Link
        onClick={() => setShowMap(true)}
        className="flex font-semibold underline mb-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        {booking.place.address}
      </Link>
      <Link className="text-xl bg-transparent border shadow-xl rounded-2xl p-2" to={"/place/" + booking.place._id}>Take a look at the place again</Link>
      <hr className="w-72 mt-4 mb-2"/>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          {format(new Date(booking.checkIn), 'MMMM dd, yyyy')} {" "}until{" "}{format(new Date(booking.checkOut), 'MMMM dd, yyyy')}{"."}
            <br/>
            <div className="info-container text-gray-600">
              <text>{booking.numGuests} guests</text>
              <text>{booking.place.maxBeds} beds</text>
              <text>{booking.place.numBaths} baths</text>
              <text>{booking.stayDays} {" "} days and {booking.stayDays-1} nights</text>
            </div>
        </div>
        <div className="bg-indigo-400 p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">€ {booking.price}</div>
        </div>
      </div>
      {/* <PlaceGallery place={booking.place} /> */}
      <div>
        <h2 className="text-2xl">Messages with the host</h2>
        {/* <Messages></Messages> */}
      </div>
    </div>
  );
}
