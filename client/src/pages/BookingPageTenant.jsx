import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccounNav";
// import PlaceGallery from "../PlaceGallery";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import format from "date-fns/format";
import PlaceGallery from "../PlaceGallery";

export default function BookingPageTenant() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          console.log(foundBooking);
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
    <div className="my-8 mx-12">
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
      <hr className="w-72 mt-4" />
      <div className="bg-gray-200 p-4 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Your booking information:</h2>
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
            {format(new Date(booking.checkIn), "MMMM dd, yyyy")} until{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
            {format(new Date(booking.checkOut), "MMMM dd, yyyy")}
            {"."}
          </div>
          <div className="mt-1 info-container text-gray-700">
            <text>{booking.numGuests} guests</text>
            <text>{booking.place.maxBeds} beds</text>
            <text>{booking.place.numBaths} baths</text>
            <text>{booking.stayNights} nights</text>
          </div>
        </div>
        <div className="bg-indigo-400 text-center p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">€ {booking.price}</div>
        </div>
      </div>
      <div className="my-6">
        <PlaceGallery place={booking.place} />
      </div>
      <div className="mt-4 mb-4">
        <Link
          className="gap-1 py-2 px-3 bg-slate-50 rounded-2xl shadow-md shadow-gray-600"
          to={"/place/" + booking.place._id}
        >
          Take a look at the place again
        </Link>
      </div>

      <div>
        <p className="text-gray-700 text-sm">
          To cancel your reservation, please provide us with a minimum of{" "}
          <span className="font-semibold">20 days'</span> notice before your
          intended cancellation date. This allows us to efficiently handle any
          necessary arrangements. Your cooperation is greatly appreciated.
        </p>
      </div>
      <button className="bg-red-700 p-3 mt-1 text-white rounded-2xl text-right">
        Cancel the Reservation
      </button>
      <hr className="mt-6 mb-2" />
      <div className="mt-4">
        <h2 className="text-2xl">Messages with the Host</h2>
        {/* <Messages></Messages> */}
      </div>
    </div>
  );
}
